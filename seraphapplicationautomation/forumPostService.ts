import { connect, Browser, LaunchOptions, Page } from "puppeteer";
import { Logger } from "@azure/functions";
import SeraphApplicationFormData from "./seraphApplicationFormData";

export default class ForumPostService {
    private logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }

    public async PostToRecruitmentForum(formData: SeraphApplicationFormData): Promise<string> {
        this.logger("beginning forum posting");

        let browser: Browser = null;

        try {
            browser = await connect({
                browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.browserlessIOToken}`
            });
            let page: Page = await this.NavigateToForumWebsite(browser);

            await this.LoginToForum(page, process.env.forumUsername, process.env.forumPassword);
            await this.NavigateToPostingPage(page);

            let subject: string = this.BuildForumPostSubject(formData);
            let message: string = this.BuildForumPostMessage(formData);

            await this.PostMessage(page, subject, message);
            let forumPostUrl: string = await this.GetForumPostUrl(page);
            browser.close();
            this.logger("Successfully posted application to the forum");
            return forumPostUrl;
        } catch (ex) {
            browser.close();
            this.logger(`An exception occured while sending the request: ${ex.message}`);
            throw ex;
        }
    }

    private async NavigateToForumWebsite(browser: Browser): Promise<Page> {
        let page: Page = await browser.newPage();
        await page.goto("http://www.seraphguildforums.com/");
        return page;
    }

    private async LoginToForum(page: Page, username: string, password: string): Promise<void> {
        await page.waitForSelector("input[title=\"Username\"]");
        await page.type("input[title=\"Username\"]", username);
        await page.type("input[type=\"password\"]", password);
        await page.waitFor(500);
        await page.click("input[type=\"submit\"]");
    }

    private async NavigateToPostingPage(page: Page): Promise<void> {
        await page.waitForSelector("li[id=\"username_logged_in\"]");

        await page.click("ul.topiclist.forums > li:nth-child(2) > dl > dt > div > a");
        await page.waitForSelector("a[title=\"Post a new topic\"]");
        await page.click("a[title=\"Post a new topic\"]");
    }

    private BuildForumPostSubject(formData: SeraphApplicationFormData): string {
        let preferredTeams: string = formData.TeamsApplyingFor.reduce((prevValue: string, currValue: string) => {
            if (currValue.indexOf("Membership") > -1) {
                return `${prevValue}, M`;
            }

            return `${prevValue}, ${currValue[0]}`;
        }, "").substring(2);

        let characterName = formData.CharacterNameAndServer.split(" ")[0];

        return `(${preferredTeams}) ${characterName}, ${formData.MainSpec} ${formData.Class}`;
    }

    private BuildForumPostMessage(formData: SeraphApplicationFormData): string {
        let message = `Battle Tag:\n${formData.BattleTag}\n\n`;
        message += `Discord Tag:\n${formData.DiscordTag}\n\n`;
        message += `Character Name & Server:\n${formData.CharacterNameAndServer}\n\n`;
        message += `Class:\n${formData.Class}\n\n`;
        message += `Main Spec:\n${formData.MainSpec}\n\n`;
        message += `Viable Off-Spec(s) or Alts:\n${formData.OffspecsAndAlts}\n\n`;
        message += `Specific Raiding & Guild History:\n${formData.RaidingHistory}\n\n`;
        message += `Armory Link:\n${formData.ArmoryLink}\n\n`;
        message += `Recent Raid Combat Logs:\n${formData.RecentCombatLogs}\n\n`;
        message += `Which teams are you applying for?:\n${formData.TeamsApplyingFor.reduce((prevValue: string, currValue: string) => `${prevValue}\n${currValue}`)}\n`;
        message += `Team preference: ${formData.TeamPreference || 'No preference given'}\n\n`
        message += `Where did you hear about Seraph?:\n${formData.LearnAboutSeraph.reduce((prevValue: string, currValue: string) => `${prevValue}\n${currValue}`)}\n\n`;
        message += `Age & (Preferred) Gender:\n${formData.AgeAndGender}\n\n`
        return message += `Anything else you would like us to know:\n${formData.ApplicantNote}`
    }

    private async PostMessage(page: Page, subject: string, message: string): Promise<void> {
        await page.waitForSelector("input[name=\"subject\"]");
        await page.type("input[name=\"subject\"]", subject);
        await page.waitFor(500);
        await page.type("div#message-box > textarea[name=\"message\"]", message);
        await page.click("input.default-submit-action[type=\"submit\"]");
    }

    private async GetForumPostUrl(page: Page): Promise<string> {
        await page.waitForSelector("h2.topic-title");
        return page.url();
    }
}