import {Component} from '@angular/core';
import {NotificationOptions} from '../kernel/config/notifications.config';
import {PreloaderService} from '../kernel/services/preloader.service';

@Component({
    selector: 'app-root',
    template: '<ngx-loading-bar></ngx-loading-bar><simple-notifications [options]="options"></simple-notifications><router-outlet></router-outlet>'
})
export class BoostrapComponent {
    public options = NotificationOptions;
    constructor(private preloader: PreloaderService){}
    ngAfterViewInit()
    {
        this.preloader.stop();
    }
}