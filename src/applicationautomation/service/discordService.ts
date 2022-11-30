import { Logger } from '@azure/functions';
import { 
    Client, 
    ClientOptions, 
    EmbedField,
    FetchGuildOptions,
    TextChannel,
    Guild,
    Snowflake,
    AllowedThreadTypeForTextChannel,
    ThreadChannel,
    GuildTextThreadManager,
    IntentsBitField,
    MessageCreateOptions,
    APIEmbed,
    StartThreadOptions,
    ThreadAutoArchiveDuration,
} from 'discord.js';
import { env } from 'process';

import { StringKeyMap } from '../model/common/types.js';
import SeraphApplicationFormData from '../model/seraphApplicationFormData.js';

const ClassColorCodeMap: StringKeyMap<number> = {
    'Death Knight': 12853051,
    'Demon Hunter': 10694857,
    'Druid': 16743690,
    'Hunter': 11129457,
    'Mage': 4245483,
    'Monk': 65430,
    'Paladin': 16092346,
    'Priest': 16777215,
    'Rogue': 16774505,
    'Shaman': 28894,
    'Warlock': 8882157,
    'Warrior': 13081710,
    'Evoker': 3380095
};

const TeamRoleIds: StringKeyMap<string> = {
    '1. Barely Heroic': '648692259927359503',
    '2. Casually Dysfunctional': '352083485420290058',
    '3. Misfits': '579784598263693313'
};

const AdminRoleId: string = '328651719158267905';

export default class DiscordService {
    private logger: Logger;
    private client: Client;

    private fetchGuildOptions: FetchGuildOptions

    constructor(logger: Logger) {
        this.logger = logger;

        const clientOptions: ClientOptions = {
            intents: [
                IntentsBitField.Flags.Guilds, 
                IntentsBitField.Flags.GuildMessages
            ]
        } as ClientOptions;
        this.client = new Client(clientOptions);

        this.fetchGuildOptions = {
            guild: env.guildId as Snowflake
        } as FetchGuildOptions;
    }

    public async SendApplicationNotification(formData: SeraphApplicationFormData): Promise<boolean> {
        this.logger('POSTing form data to discord channel');
        const message: MessageCreateOptions = DiscordService.GetMessage(formData);

        try {
            await this.CreateThread(formData.CharacterNameAndServer, message);
        } catch (ex) {
            this.logger(`An exception occured while sending the request: ${ex}`);
            return false;
        }

        this.logger('Successfully posted form data to discord channel');
        return true;
    }

    private async CreateThread(threadTitle: string, messageOptions: MessageCreateOptions): Promise<void> {
        const threadCreateOptions: StartThreadOptions = {
            autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
            name: threadTitle
        } as StartThreadOptions;

        await this.client.login(env.botToken as string);
        const guild: Guild = await this.client.guilds.fetch(this.fetchGuildOptions);
        const threadManager: GuildTextThreadManager<AllowedThreadTypeForTextChannel> = ((await guild.channels.fetch(env.applicationChannelId as string)) as TextChannel).threads;
        const threadChannel: ThreadChannel = await threadManager.create(threadCreateOptions);

        if (!threadChannel.joined) {
            await threadChannel.join();
        }

        await threadChannel.send(messageOptions);
    }

    private static GetMessage(formData: SeraphApplicationFormData): MessageCreateOptions {
        const messageContent: string = DiscordService.GetMessageContent(formData.TeamsApplyingFor, formData.TeamPreference);
        const messageEmbeds: APIEmbed[] = [DiscordService.GetMessageEmbeds(formData)];

        return {
            content: messageContent,
            embeds: messageEmbeds,
        } as MessageCreateOptions;
    }

    private static GetMessageContent(appedTeams: string[], teamPreference: string): string {
        const appedTeamTags = appedTeams.reduce((appedTeamString: string, currentAppedTeam: string) => {
            if (currentAppedTeam.indexOf('General Membership') !== -1) {
                return `${appedTeamString ? `${appedTeamString} and ` : ''}${currentAppedTeam} (<@&${AdminRoleId}>)`;
            }

            return `${appedTeamString} <@&${TeamRoleIds[currentAppedTeam]}>`
        }, '');

        const prefenceSnippet = `Team Preference: ${(teamPreference ? teamPreference : 'No preference given')}`;

        return `A new guild application has been submitted for ${appedTeamTags}\n${prefenceSnippet}`;
    }

    private static GetMessageEmbeds(formData: SeraphApplicationFormData): APIEmbed {
        return {
            color: ClassColorCodeMap[formData.Class],
            fields: [
                DiscordService.GetEmbedField('Battle.Net', formData.BattleTag, true),
                DiscordService.GetEmbedField('Discord Tag', formData.DiscordTag, true),
                DiscordService.GetEmbedField('Age & (Preferred) Gender', formData.AgeAndGender, true),
                DiscordService.GetEmbedField('Character Name & Server', formData.CharacterNameAndServer, true),
                DiscordService.GetEmbedField('Main Spec', formData.MainSpec, true),
                DiscordService.GetEmbedField('Viable Off-Spec(s) or Alts', formData.OffspecsAndAlts || '*none provided*'),
                DiscordService.GetEmbedField('Recent Combat Logs', formData.RecentCombatLogs),
                DiscordService.GetEmbedField('WoW Armory', `[Armory Link](${formData.ArmoryLink})`, true),
                DiscordService.GetEmbedField('Specific Raiding & Guild History', formData.RaidingHistory),
                DiscordService.GetEmbedField('Applicant Note', formData.ApplicantNote),
                DiscordService.GetEmbedField('Where did you hear about Seraph?', formData.LearnAboutSeraph.reduce((prev: string, curr: string) => `${prev}\n  * ${curr}`)),
            ],
            footer: {
                text: `Posted at: ${new Date().toDateString()} ${new Date().toTimeString()}`
            }
        } as APIEmbed;
    }

    private static GetEmbedField(name: string, value: string, inline: boolean = false): EmbedField {
        return {
            name: name,
            value: value,
            inline: inline
        } as EmbedField;
    }
}
