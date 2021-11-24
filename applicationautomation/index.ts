import { AzureFunction, Context, HttpRequest } from '@azure/functions'

import DiscordService from './service/discordService.js';
import SeraphApplicationFormData from './model/seraphApplicationFormData.js';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const requestBody: StringKeyMap<string | string[]> = req.body as StringKeyMap<string | string[]>;
    context.log(`application received: ${JSON.stringify(req.body)}`);

    const formData = new SeraphApplicationFormData(requestBody);
    const discordService: DiscordService = new DiscordService(context.log);

    const statusCode: number = await discordService.SendApplicationNotification(formData) ? 204 : 500;
    
    context.res = {
        status: statusCode,
    };

    context.log(`processed application. Status Code ${statusCode}`);

    if (statusCode === 500) {
        throw new Error('Failed to post application to discord');
    }
};

export default httpTrigger;
