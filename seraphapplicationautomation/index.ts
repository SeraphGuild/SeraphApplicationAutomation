import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import DiscordService from "./discordService";
import ForumPostService from "./forumPostService";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log(`application received: ${JSON.stringify(req.body)}`);

    let forumPostService: ForumPostService = new ForumPostService(context.log);
    let forumPostUrl = "";

    try {
        forumPostUrl = await forumPostService.PostToRecruitmentForum(req.body);
    } catch (ex) {
        context.log(`An expcetion occurred while posting to the forum: ${ex}`);
        context.res = {
            status: 500,
        };

        return;
    }

    let discordService: DiscordService = new DiscordService(context.log);
    let statusCode: number = await discordService.SendApplicationNotification(req.body, forumPostUrl) ? 204 : 500;
    context.res = {
        status: statusCode,
    };

    context.log(`processed application. Status Code ${statusCode}`);
};

export default httpTrigger;
