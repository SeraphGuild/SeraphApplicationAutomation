import { AzureFunction, Context, HttpRequest } from '@azure/functions'

import DiscordService from './service/discordService.mjs';

import StringKeyMap from './model/common/stringKeyMap.mjs';
import SeraphApplicationFormData from './model/seraphApplicationFormData.mjs';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    let requestBody: StringKeyMap<string | string[]> = req.body as StringKeyMap<string | string[]>;
    context.log(`application received: ${JSON.stringify(req.body)}`);

    let formData = new SeraphApplicationFormData(requestBody);
    let discordService: DiscordService = new DiscordService(context.log);

    let statusCode: number = await discordService.SendApplicationNotification(formData) ? 204 : 500;
    
    context.res = {
        status: statusCode,
    };

    context.log(`processed application. Status Code ${statusCode}`);

    if (statusCode === 500) {
        throw new Error('Failed to post application to discord');
    }
};

export default httpTrigger;
