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
              this.translate.get('errorPages.' + params["code"] + '.title').subscribe((res: string) => {
                this.errorTitle = res;
              });
              this.translate.get('errorPages.' + params["code"] + '.desc').subscribe((res: string) => {
                this.errorDesc = res;
              });
            }
            else {
              this.translate.get('errorPages.generic.title').subscribe((res: string) => {
                this.errorTitle = res;
              });
              this.translate.get('errorPages.generic.desc').subscribe((res: string) => {
                this.errorDesc = res;
              });
            }
          });
        });
    }
}
