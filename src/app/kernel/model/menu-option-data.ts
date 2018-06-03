export class MenuOptionData {
    icon:string;
    validRanks:number[];
    hidden:boolean = false;
    isProfileText:boolean = false;
    constructor(icon,validRanks,hidden = false, isProfileText = false)
    {
        this.icon = icon;
        this.validRanks = validRanks;
        this.hidden = hidden;
        this.isProfileText = isProfileText;
    }
}