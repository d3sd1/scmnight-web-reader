import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {TranslateService} from '@ngx-translate/core';
@Component({
    templateUrl: '../templates/error.component.html'
})
export class ErrorComponent {
    public errorTitle;
    public errorDesc;
    constructor(private route: ActivatedRoute, private translate: TranslateService) {
        this.route.params.subscribe(params => {
          translate.get('errorPages').subscribe((codes: Array<string>) => {
            if (!isNaN(params["code"]) && params["code"] in codes) {
              this.errorTitle = this.translate.get("errorPages")["value"][params["code"]]["title"];
              this.errorDesc = this.translate.get("errorPages")["value"][params["code"]]["desc"];
            }
            else {
              this.errorTitle = this.translate.get("errorPages")["value"]["generic"]["title"];
              this.errorDesc = this.translate.get("errorPages")["value"]["generic"]["desc"];
            }
          });
        });
    }
}
