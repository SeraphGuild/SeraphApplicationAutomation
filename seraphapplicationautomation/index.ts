import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import DiscordService from "./discordService";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log(`application received: ${JSON.stringify(req.body)}`);

    let service: DiscordService = new DiscordService(context.log);
    let statusCode: number = await service.SendApplicationNotification(req.body) ? 204 : 500;
    context.res = {
        status: statusCode,
    };

    context.log(`processed application. Status Code ${statusCode}`);
};

export default httpTrigger;
