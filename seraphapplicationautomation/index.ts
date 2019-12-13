import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import DiscordService from "./discordService";
import ForumPostService from "./forumPostService";
import SeraphApplicationFormData from "./seraphApplicationFormData";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log(`application received: ${JSON.stringify(req.body)}`);
    
    let formData = new SeraphApplicationFormData(req.body);
    let forumPostService: ForumPostService = new ForumPostService(context.log);

    let forumPostUrl = "";
    try {
        forumPostUrl = await forumPostService.PostToRecruitmentForum(formData);
    } catch (ex) {
        context.log(`An expcetion occurred while posting to the forum: ${ex.message}`);
        context.res = {
            status: 500,
            headers: {
                "Content-Type": "application/json" 
            },
            body: {
                message: ex.message
            }
        };

        return;
    }

    let discordService: DiscordService = new DiscordService(context.log);
    let statusCode: number = await discordService.SendApplicationNotification(formData, forumPostUrl) ? 204 : 500;
    context.res = {
        status: statusCode,
    };

    context.log(`processed application. Status Code ${statusCode}`);
};

export default httpTrigger;
