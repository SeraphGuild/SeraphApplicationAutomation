import { launch, Browser, LaunchOptions, Page } from "puppeteer";
import { Logger } from "@azure/functions";

export default class ForumPostService {
    private logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }

    public async PostToRecruitmentForum(formData: {string: (string[] | string)}): Promise<string> {
        this.logger("beginning forum posting");

        try {
            let browser: Browser = await launch();
            let page: Page = await this.NavigateToForumWebsite(browser);

            await this.LoginToForum(page, process.env.forumUsername, process.env.forumPassword);
            await this.NavigateToPostingPage(page);

            let forumPost: { subject: string, message: string } = this.BuildForumPostMessage(formData);

            await this.PostMessage(page, forumPost);
            let forumPostUrl: string = await this.GetForumPostUrl(page);

            this.logger("Successfully posted application to the forum");
            return forumPostUrl;
        } catch (ex) {
            this.logger(`An exception occured while sending the request: ${ex}`);
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

    private BuildForumPostMessage(formData: {string: (string[] | string)}): { subject: string, message: string } {
        return {
            subject: "This is a test",
            message: "Ah fuck yeah!"
        }
    }

    private async PostMessage(page: Page, forumPost: { subject: string, message: string }): Promise<void> {
        await page.waitForSelector("input[name=\"subject\"]");
        await page.type("input[name=\"subject\"]", forumPost.subject);
        await page.type("div#message-box > textarea[name=\"message\"]", forumPost.message);
        await page.click("input.default-submit-action[type=\"submit\"]");
    }

    private async GetForumPostUrl(page: Page): Promise<string> {
        await page.waitForSelector("h2.topic-title");
        return page.url();
    }
}