import * as request from "request-promise-native";
import { Logger } from "@azure/functions";
import { RichEmbed, WebhookClient, WebhookMessageOptions } from "discord.js";
import { stringify } from "querystring";

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

export default class DiscordService {
    private logger: Logger;
    private webhookClient: WebhookClient;

    constructor(logger: Logger) {
        this.logger = logger;
        this.webhookClient = new WebhookClient("653344221624926218", "Qy8hcrtGpvzVDmqgsD47eUc7luc9j_4vu7pzqFsGyH1xpmmSPIZovB1i8r59MtcG1Ao-");
    }

    public async SendApplicationNotification(formData: {string: string[]}): Promise<boolean> {
        this.logger("POSTing form data to discord channel");

        try {
            await this.webhookClient.send(
                DiscordService.GetMessageContent(formData["Which team(s) are you applying for?"], formData["Team Preference:"]), 
                DiscordService.GetRequestOptions(formData));
            this.logger("Successfully posted form data to discord channel");
            return true;
        } catch (ex) {
            this.logger(`An exception occured while sending the request: ${ex}`);
            return false;
        }
    }

    private static GetRequestOptions(formData: {string: string[]}): any {
        return <WebhookMessageOptions>{
            username: "Seraph Application Automation",
            avatarURL: "https://cdn.discordapp.com/icons/328648081597792268/cb0dfe6bdef6ee1a280a70f9fb4688ae.png?size=128",
            tts: false,
            embeds: [
                <RichEmbed>{
                    title: "A new application has been posted to the forums for review",
                    url: "https://www.seraphguildforums.com/viewforum.php?f=2",
                    color: ClassColorCodeMap[formData["Class:"]],
                    fields: [
                        {
                            name: "Battle.Net",
                            value: formData["Battle Tag:"],
                            inline: true
                        },
                        {
                            name: "Discord Tag",
                            value: formData["Discord Tag:"],
                            inline: true
                        },
                        {
                            name: "Age & (Preferred) Gender",
                            value: formData["Age & (Preferred) Gender"],
                            inline: true
                        },
                        {
                            name: "Character Name & Server",
                            value: formData["Character Name & Server:"],
                            inline: true
                        },
                        {
                            name: "Main Spec",
                            value: formData["Main Spec:"],
                            inline: true
                        },
                        {
                            name: "Viable Off-Spec(s) or Alts",
                            value: formData["Viable Off-Spec(s) or Alts:"] || "*none provided*",
                        },
                        {
                            name: "Recent Combat Logs",
                            value: formData["Recent Raid Combat Logs:"],
                        },
                        {
                            name: "WoW Armory",
                            value: `[Armory Link](${formData["Armory Link:"]})`,
                            inline: true
                        },
                        {
                            name: "Specific Raiding & Guild History",
                            value: formData["Specific Raiding & Guild History:"] || "*none provided*"
                        },
                        {
                            name: "Applicant Note",
                            value: formData["Anything else you would like us to know:"] || "*none provided*"
                        },
                        {
                            name: "Where did you hear about Seraph?",
                            value: formData["Where did you hear about Seraph?"].reduce((prev: string, curr: string) => `${prev}\n  * ${curr}`)
                        }
                    ],
                    image: {
                        url: formData["Please link a screenshot of your UI in combat:"]
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
                return prevPref;
            }

            return `${prevPref} @R${currentPref[0]}`
        }, "");

        const prefenceSnippet = appedTeams.length > 1 && teamPreference ? `Team Preference: ${teamPreference}` : "Team Preference: No preference given";

        return `A new guild application has been submitted for ${appedTeamTags}${appedTeams.length > 1 ? "\n" : ""}${prefenceSnippet}`;
    }
}