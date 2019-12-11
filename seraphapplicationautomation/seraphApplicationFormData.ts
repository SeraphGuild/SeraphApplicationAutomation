export default class SeraphApplicationFormData {
    constructor(formData: {string: (string | string[])}) {
        this.BattleTag = formData["Battle Tag:"];
        this.DiscordTag = formData["Discord Tag:"];
        this.CharacterNameAndServer = formData["Character Name & Server:"];
        this.Class = formData["Class:"];
        this.MainSpec = formData["Main Spec:"];
        this.OffspecsAndAlts = formData["Viable Off-Spec(s) or Alts:"];
        this.RaidingHistory = formData["Specific Raiding & Guild History:"];
        this.ArmoryLink = formData["Armory Link:"];
        this.RecentCombatLogs = formData["Recent Raid Combat Logs:"];
        this.UIScreenshotLink = formData["Please link a screenshot of your UI in combat:"];
        this.TeamsApplyingFor = formData["Which team(s) are you applying for?"];
        this.TeamPreference = formData["Team Preference:"];
        this.LearnAboutSeraph = formData["Where did you hear about Seraph?"];
        this.AgeAndGender = formData["Age & (Preferred) Gender"];
        this.ApplicantNote = formData["Anything else you would like us to know:"];
    }

    public BattleTag: string;

    public DiscordTag: string;

    public CharacterNameAndServer: string;

    public Class: string;

    public MainSpec: string;

    public OffspecsAndAlts: string;

    public RaidingHistory: string;

    public ArmoryLink: string;

    public RecentCombatLogs: string;

    public UIScreenshotLink: string;

    public TeamsApplyingFor: string[];

    public TeamPreference: string;

    public LearnAboutSeraph: string[];

    public AgeAndGender: string;

    public ApplicantNote: string;
}