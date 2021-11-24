import StringKeyMap from './common/stringKeyMap.mjs';

export default class SeraphApplicationFormData {
    constructor(formData: StringKeyMap<string | string[]>) {
        this.BattleTag = formData['Battle Tag:'] as string;
        this.DiscordTag = formData['Discord Tag:'] as string;
        this.CharacterNameAndServer = formData['Character Name & Server:'] as string;
        this.Class = formData['Class:'] as string;
        this.MainSpec = formData['Main Spec:']  as string;
        this.OffspecsAndAlts = formData['Viable Off-Spec(s) or Alts:'] as string;
        this.RaidingHistory = formData['Specific Raiding & Guild History:'] as string;
        this.ArmoryLink = formData['Armory Link:'] as string;
        this.RecentCombatLogs = formData['Recent Raid Combat Logs:'] as string;
        this.TeamsApplyingFor = formData['Which team(s) are you applying for?'] as string[];
        this.TeamPreference = formData['Team Preference:'] as string;
        this.LearnAboutSeraph = formData['Where did you hear about Seraph?'] as string[];
        this.AgeAndGender = formData['Age & (Preferred) Gender'] as string;
        this.ApplicantNote = formData['Anything else you would like us to know:'] as string;
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

    public TeamsApplyingFor: string[];

    public TeamPreference: string;

    public LearnAboutSeraph: string[];

    public AgeAndGender: string;

    public ApplicantNote: string;
}