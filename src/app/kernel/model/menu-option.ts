export class MenuOption {
    public icon: string = "home";
    public text: string = "Menú sin texto";
    public link: string = "javascript:void(0)";
    public submenus:MenuOption[] = [];
    active:boolean = false;
    constructor(icon,text,link?,submenus?)
    {
        this.icon = icon;
        this.text = text;
        if(typeof link !== "undefined")
        {
            this.link = link;
        }
        else if(this.link === null)
        {
            this.link = "javascript:void(0)";
        }
        if(typeof submenus !== "undefined")
        {
            this.submenus = submenus;
        }
        else if(submenus == null)
        {
            submenus = [];
        }
    }
}