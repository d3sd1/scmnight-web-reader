export class Permission {
  public id: number = null;
  public action: string = null;
  public checked: boolean = false;
  constructor() {
    this.checked = false;
  }
}
