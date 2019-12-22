[1mdiff --git a/seraphapplicationautomation/discordService.ts b/seraphapplicationautomation/discordService.ts[m
[1mindex cd9cdc8..9fc42dc 100644[m
[1m--- a/seraphapplicationautomation/discordService.ts[m
[1m+++ b/seraphapplicationautomation/discordService.ts[m
[36m@@ -109,11 +109,11 @@[m [mexport default class DiscordService {[m
                         },[m
                         {[m
                             name: "Specific Raiding & Guild History",[m
[31m-                            value: formData.RaidingHistory || "*none provided*"[m
[32m+[m[32m                            value: formData.RaidingHistory && (formData.RaidingHistory.length > 1024 ? (formData.RaidingHistory.substr(0, 1021) + "..."))  || "*none provided*"[m
                         },[m
                         {[m
                             name: "Applicant Note",[m
[31m-                            value: formData.ApplicantNote || "*none provided*"[m
[32m+[m[32m                            value: formData.ApplicantNote && (formData.ApplicantNote.length > 1024 ? (formData.ApplicantNote.substr(0, 1021) + "...")) || "*none provided*"[m
                         },[m
                         {[m
                             name: "Where did you hear about Seraph?",[m
[36m@@ -134,7 +134,7 @@[m [mexport default class DiscordService {[m
     private static GetMessageContent(appedTeams: string[], teamPreference: string): string {[m
         const appedTeamTags = appedTeams.reduce((prevPref: string, currentPref: string) => {[m
             if (currentPref === "General Membership") {[m
[31m-                return `prevPref ${currentPref}`;[m
[32m+[m[32m                return `${prevPref} and ${currentPref}`;[m
             }[m
 [m
             return `${prevPref} <@&${RoleIds[(+currentPref[0])-1]}> (R${currentPref[0]})`[m
[1mdiff --git a/seraphapplicationautomation/index.ts b/seraphapplicationautomation/index.ts[m
[1mindex c43ac22..d1340c7 100644[m
[1m--- a/seraphapplicationautomation/index.ts[m
[1m+++ b/seraphapplicationautomation/index.ts[m
[36m@@ -6,12 +6,14 @@[m [mimport SeraphApplicationFormData from "./seraphApplicationFormData";[m
 const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {[m
     context.log(`application received: ${JSON.stringify(req.body)}`);[m
     [m
[32m+[m[32m    let forumPostUrl : string = req.params['forumlink'];[m
     let formData = new SeraphApplicationFormData(req.body);[m
     let forumPostService: ForumPostService = new ForumPostService(context.log);[m
 [m
[31m-    let forumPostUrl = "";[m
     try {[m
[31m-        forumPostUrl = await forumPostService.PostToRecruitmentForum(formData);[m
[32m+[m[32m        if (Boolean(forumPostUrl)) {[m
[32m+[m[32m            forumPostUrl = await forumPostService.PostToRecruitmentForum(formData);[m
[32m+[m[32m        }[m
     } catch (ex) {[m
         context.log(`An expcetion occurred while posting to the forum: ${ex.message}`);[m
         context.res = {[m
