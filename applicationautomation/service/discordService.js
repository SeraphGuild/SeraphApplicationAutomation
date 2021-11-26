import { WebhookClient } from 'discord.js';
import { env } from 'process';
const ClassColorCodeMap = {
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
const TeamRoleIds = {
    '1. Color Blind': '352083357376708608',
    '2. Casually Dysfunctional': '352083485420290058',
    '3. Last Pull': '438160508714221578',
    '4. Misfits': '579784598263693313',
    '5. Loud Noises!': '595341062000738364',
    '6. Barely Heroic': '648692259927359503'
};
const AdminRoleId = '328651719158267905';
export default class DiscordService {
    constructor(logger) {
        this.logger = logger;
        const clientData = {
            id: env.clientId,
            token: env.clientToken
        };
        this.webhookClient = new WebhookClient(clientData);
    }
    async SendApplicationNotification(formData) {
        this.logger('POSTing form data to discord channel');
        const requestOptions = DiscordService.GetRequestOptions(formData);
        try {
            await this.webhookClient.send(requestOptions);
        }
        catch (ex) {
            this.logger(`An exception occured while sending the request: ${ex}`);
            return false;
        }
        this.logger('Successfully posted form data to discord channel');
        return true;
    }
    static GetRequestOptions(formData) {
        const messageContent = DiscordService.GetMessageContent(formData.TeamsApplyingFor, formData.TeamPreference);
        const messageEmbeds = [DiscordService.GetMessageEmbeds(formData)];
        return {
            content: messageContent,
            username: 'Seraph Application Automation',
            avatarURL: 'https://cdn.discordapp.com/icons/328648081597792268/cb0dfe6bdef6ee1a280a70f9fb4688ae.png?size=128',
            tts: false,
            embeds: messageEmbeds
        };
    }
    static GetMessageContent(appedTeams, teamPreference) {
        const appedTeamTags = appedTeams.reduce((appedTeamString, currentAppedTeam) => {
            if (currentAppedTeam === 'General Membership') {
                return `${appedTeamString ? `${appedTeamString} and ` : ''}${currentAppedTeam} (<@&${AdminRoleId}>)`;
            }
            return `${appedTeamString} <@&${TeamRoleIds[currentAppedTeam]}>`;
        }, '');
        const prefenceSnippet = `Team Preference: ${(teamPreference ? teamPreference : 'No preference given')}`;
        return `A new guild application has been submitted for ${appedTeamTags}\n${prefenceSnippet}`;
    }
    static GetMessageEmbeds(formData) {
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
                DiscordService.GetEmbedField('Where did you hear about Seraph?', formData.LearnAboutSeraph.reduce((prev, curr) => `${prev}\n  * ${curr}`)),
            ],
            footer: {
                text: `Posted at: ${new Date().toDateString()} ${new Date().toTimeString()}`
            }
        };
    }
    static FormatLongFormField(fieldValue) {
        if (fieldValue) {
            return fieldValue.length > 1024 ? (fieldValue.substr(0, 1021).trim() + '...') : fieldValue;
        }
        return '*none provided*';
    }
    static GetEmbedField(name, value, inline = false) {
        return {
            name: name,
            value: value,
            inline: inline
        };
    }
}
//# sourceMappingURL=discordService.js.map