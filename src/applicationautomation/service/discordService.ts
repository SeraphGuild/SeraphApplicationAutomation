import { Logger } from '@azure/functions';
import { EmbedField, MessageEmbed, WebhookClient, WebhookClientData, WebhookMessageOptions } from 'discord.js';
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
    'Warrior': 13081710
};

const TeamRoleIds: StringKeyMap<string> = {
    '1. Color Blind': '352083357376708608',
    '2. Casually Dysfunctional': '352083485420290058',
    '3. Last Pull': '438160508714221578',
    '4. Misfits': '579784598263693313',
    '5. Loud Noises!': '595341062000738364',
    '6. Barely Heroic': '648692259927359503'
};

const AdminRoleId: string = '328651719158267905';

export default class DiscordService {
    private logger: Logger;
    private webhookClient: WebhookClient;

    constructor(logger: Logger) {
        this.logger = logger;

        const clientData: WebhookClientData = {
            id: env.clientId,
            token: env.clientToken
        } as WebhookClientData;

        this.webhookClient = new WebhookClient(clientData);
    }

    public async SendApplicationNotification(formData: SeraphApplicationFormData): Promise<boolean> {
        this.logger('POSTing form data to discord channel');
        const requestOptions: WebhookMessageOptions = DiscordService.GetRequestOptions(formData);

        try {
            await this.webhookClient.send(requestOptions);
        } catch (ex) {
            this.logger(`An exception occured while sending the request: ${ex}`);
            return false;
        }

        this.logger('Successfully posted form data to discord channel');
        return true;
    }

    private static GetRequestOptions(formData: SeraphApplicationFormData): WebhookMessageOptions {
        const messageContent: string = DiscordService.GetMessageContent(formData.TeamsApplyingFor, formData.TeamPreference);
        const messageEmbeds: MessageEmbed[] = [DiscordService.GetMessageEmbeds(formData)];

        return {
            content: messageContent,
            username: 'Seraph Application Automation',
            avatarURL: 'https://cdn.discordapp.com/icons/328648081597792268/cb0dfe6bdef6ee1a280a70f9fb4688ae.png?size=128',
            tts: false,
            embeds: messageEmbeds
        } as WebhookMessageOptions;
    }

    private static GetMessageContent(appedTeams: string[], teamPreference: string): string {
        const appedTeamTags = appedTeams.reduce((appedTeamString: string, currentAppedTeam: string) => {
            if (currentAppedTeam === 'General Membership') {
                return `${appedTeamString ? `${appedTeamString} and ` : ''}${currentAppedTeam} (<@&${AdminRoleId}>)`;
            }

            return `${appedTeamString} <@&${TeamRoleIds[currentAppedTeam]}>`
        }, '');

        const prefenceSnippet = `Team Preference: ${(teamPreference ? teamPreference : 'No preference given')}`;

        return `A new guild application has been submitted for ${appedTeamTags}\n${prefenceSnippet}`;
    }

    private static GetMessageEmbeds(formData: SeraphApplicationFormData) {
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
                DiscordService.GetEmbedField('Specific Raiding & Guild History', DiscordService.FormatLongFormField(formData.RaidingHistory)),
                DiscordService.GetEmbedField('Applicant Note', DiscordService.FormatLongFormField(formData.ApplicantNote)),
                DiscordService.GetEmbedField('Where did you hear about Seraph?', formData.LearnAboutSeraph.reduce((prev: string, curr: string) => `${prev}\n  * ${curr}`)),
            ],
            footer: {
                text: `Posted at: ${new Date().toDateString()} ${new Date().toTimeString()}`
            }
        } as MessageEmbed;
    }

    private static FormatLongFormField(fieldValue: string): string {
        if (fieldValue) {
            return fieldValue.length > 1024 ? (fieldValue.substr(0, 1021).trim() + '...') : fieldValue;
        }
        
        return '*none provided*';
    }

    private static GetEmbedField(name: string, value: string, inline: boolean = false): EmbedField {
        return {
            name: name,
            value: value,
            inline: inline
        } as EmbedField;
    }
}
