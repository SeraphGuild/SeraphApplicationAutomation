# Seraph Application Automation

### Generating Azure Credentials for Config Push action

If you move a function app across subscriptions or resource groups, you'll need to generate and store new credentials for the action to auth with

```Powershell
az ad sp create-for-rbac --name "sp-applicationautomation" --role contributor --scopes '/subscriptions/$subscriptionId/resourceGroups/$resourceGroupId/providers/Microsoft.Web/sites/applicationname' --sdk-auth
```