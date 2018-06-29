export class MenuOptionData {
    icon:string;
  requiredPermission: string;
    hidden:boolean = false;
    isProfileText:boolean = false;

  constructor(icon, requiredPermission, hidden = false, isProfileText = false)
    {
        this.icon = icon;
      this.requiredPermission = requiredPermission;
        this.hidden = hidden;
        this.isProfileText = isProfileText;
    }
}
