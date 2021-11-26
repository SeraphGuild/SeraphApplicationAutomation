import DiscordService from './service/discordService.js';
import SeraphApplicationFormData from './model/seraphApplicationFormData.js';
const httpTrigger = async function (context, req) {
    const requestBody = req.body;
    context.log(`application received: ${JSON.stringify(req.body)}`);
    const formData = new SeraphApplicationFormData(requestBody);
    const discordService = new DiscordService(context.log);
    const statusCode = await discordService.SendApplicationNotification(formData) ? 204 : 500;
    context.log(`processed application. Status Code ${statusCode}`);
    if (statusCode === 500) {
        throw new Error('Failed to post application to discord');
    }
    return {
        status: statusCode
    };
};
export default httpTrigger;
//# sourceMappingURL=index.mjs.map