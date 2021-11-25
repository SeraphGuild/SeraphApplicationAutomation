// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as functionConfig from './function.json';

import { AzureFunction, Context, HttpRequest } from '@azure/functions'

import DiscordService from './service/discordService.js';
import SeraphApplicationFormData from './model/seraphApplicationFormData.js';
import { OptionalCollection, StringKeyMap } from './model/common/types.js';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<StringKeyMap<unknown>> {
    const requestBody: StringKeyMap<OptionalCollection<string>> = req.body as StringKeyMap<OptionalCollection<string>>;
    context.log(`application received: ${JSON.stringify(req.body)}`);

    const formData = new SeraphApplicationFormData(requestBody);
    const discordService: DiscordService = new DiscordService(context.log);

    const statusCode: number = await discordService.SendApplicationNotification(formData) ? 204 : 500;

    context.log(`processed application. Status Code ${statusCode}`);

    if (statusCode === 500) {
        throw new Error('Failed to post application to discord');
    }
    
    return {
        status: statusCode
    };
};

export default httpTrigger;
