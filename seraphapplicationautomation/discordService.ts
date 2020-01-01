import { Logger } from "@azure/functions";
import { RichEmbed, WebhookClient, WebhookMessageOptions } from "discord.js";
import SeraphApplicationFormData from "./seraphApplicationFormData";

const ClassColorCodeMap = {
    "Death Knight": 12853051,
    "Demon Hunter": 10694857,
    "Druid": 16743690,
    "Hunter": 11129457,
    "Mage": 4245483,
    "Monk": 65430,
    "Paladin": 16092346,
    "Priest": 16777215,
    "Rogue": 16774505,
    "Shaman": 28894,
    "Warlock": 8882157,
    "Warrior": 13081710
}

const RoleIds: string[] = [
    '352083357376708608',
    '352083485420290058',
    '438160508714221578',
    '579784598263693313',
    '595341062000738364',
    '648692259927359503'
]

const OnegUserId: string = '228326990267023370';

const VelUserId: string = '329793209347604481';

export default class DiscordService {
    private logger: Logger;
    private webhookClient: WebhookClient;

    constructor(logger: Logger) {
        this.logger = logger;
        this.webhookClient = new WebhookClient(process.env.clientId, process.env.clientToken);
    }

    public async SendApplicationNotification(formData: SeraphApplicationFormData, forumPostUrl: string): Promise<boolean> {
        this.logger("POSTing form data to discord channel");

        try {
            await this.webhookClient.send(
                DiscordService.GetMessageContent(formData.TeamsApplyingFor, formData.TeamPreference), 
                DiscordService.GetRequestOptions(formData, forumPostUrl));
            this.logger("Successfully posted form data to discord channel");
            return true;
        } catch (ex) {
            this.logger(`An exception occured while sending the request: ${ex}`);
            return false;
        }
    }

    private static GetRequestOptions(formData: SeraphApplicationFormData, forumPostUrl: string): any {
        return <WebhookMessageOptions>{
            username: "Seraph Application Automation",
            avatarURL: "https://cdn.discordapp.com/icons/328648081597792268/cb0dfe6bdef6ee1a280a70f9fb4688ae.png?size=128",
            tts: false,
            embeds: [
                <RichEmbed>{
                    title: "A new application has been posted to the forums for review",
                    url: forumPostUrl,
                    color: ClassColorCodeMap[formData.Class],
                    fields: [
                        {
                            name: "Battle.Net",
                            value: formData.BattleTag,
                            inline: true
                        },
                        {
                            name: "Discord Tag",
                            value: formData.DiscordTag,
                            inline: true
                        },
                        {
                            name: "Age & (Preferred) Gender",
                            value: formData.AgeAndGender,
                            inline: true
                        },
                        {
                            name: "Character Name & Server",
                            value: formData.CharacterNameAndServer,
                            inline: true
                        },
                        {
                            name: "Main Spec",
                            value: formData.MainSpec,
                            inline: true
                        },
                        {
                            name: "Viable Off-Spec(s) or Alts",
                            value: formData.OffspecsAndAlts || "*none provided*",
                        },
                        {
                            name: "Recent Combat Logs",
                            value: formData.RecentCombatLogs,
                        },
                        {
                            name: "WoW Armory",
                            value: `[Armory Link](${formData.ArmoryLink})`,
                            inline: true
                        },
                        {
                            name: "Specific Raiding & Guild History",
                            value: formData.RaidingHistory && (formData.RaidingHistory.length > 1024 ? (formData.RaidingHistory.substr(0, 1021).trim() + "...") : formData.RaidingHistory) || "*none provided*"
                        },
                        {
                            name: "Applicant Note",
                            value: formData.ApplicantNote && (formData.ApplicantNote.length > 1024 ? (formData.ApplicantNote.substr(0, 1021).trim() + "...") : formData.ApplicantNote) || "*none provided*"
                        },
                        {
                            name: "Where did you hear about Seraph?",
                            value: formData.LearnAboutSeraph.reduce((prev: string, curr: string) => `${prev}\n  * ${curr}`)
                        }
                    ],
                    image: {
                        url: formData.UIScreenshotLink
                    },
                    footer: {
                        text: `Posted at: ${new Date().toDateString()} ${new Date().toTimeString()}`
                    }
                }
            ]
        }
    }

    private static GetMessageContent(appedTeams: string[], teamPreference: string): string {
        const appedTeamTags = appedTeams.reduce((prevPref: string, currentPref: string) => {
            if (currentPref === "General Membership") {
                return `${prevPref ? `${prevPref} and ` : ''}${currentPref} (<@${OnegUserId}>, <@${VelUserId}>)`;
            }

            return `${prevPref} <@&${RoleIds[(+currentPref[0])-1]}>`
        }, "");

        const prefenceSnippet = `Team Preference: ${(teamPreference ? teamPreference : "No preference given")}`;

        return `A new guild application has been submitted for ${appedTeamTags}\n${prefenceSnippet}`;
    }
}