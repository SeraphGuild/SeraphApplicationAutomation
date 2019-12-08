import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log(JSON.stringify(req.body));
    context.res = {
        status: 200,
        body: req.body,
        headers: {
            "Content-Type": "application/json"
        }
    };
};

export default httpTrigger;
