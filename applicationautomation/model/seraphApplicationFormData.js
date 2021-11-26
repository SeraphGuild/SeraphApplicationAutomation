export default class SeraphApplicationFormData {
    constructor(formData) {
        this.BattleTag = formData['Battle Tag:'];
        this.DiscordTag = formData['Discord Tag:'];
        this.CharacterNameAndServer = formData['Character Name & Server:'];
        this.Class = formData['Class:'];
        this.MainSpec = formData['Main Spec:'];
        this.OffspecsAndAlts = formData['Viable Off-Spec(s) or Alts:'];
        this.RaidingHistory = formData['Specific Raiding & Guild History:'];
        this.ArmoryLink = formData['Armory Link:'];
        this.RecentCombatLogs = formData['Recent Raid Combat Logs:'];
        this.TeamsApplyingFor = formData['Which team(s) are you applying for?'];
        this.TeamPreference = formData['Team Preference:'];
        this.LearnAboutSeraph = formData['Where did you hear about Seraph?'];
        this.AgeAndGender = formData['Age & (Preferred) Gender'];
        this.ApplicantNote = formData['Anything else you would like us to know:'];
    }
}
//# sourceMappingURL=seraphApplicationFormData.js.map