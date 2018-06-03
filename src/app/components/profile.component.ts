import {Component, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import {TranslateService} from '@ngx-translate/core';
import {User} from '../kernel/model/user';
import {SessionSingleton} from '../kernel/singletons/session.singleton';

@Component({
    templateUrl: '../templates/profile.component.html'
})

export class ProfileComponent implements OnInit {
    user:User = new User();
    constructor(private translate: TranslateService, private sessionInfo: SessionSingleton)
    {
        
    }
    public languages: Array<String> = environment.availableLangs;
    ngOnInit() {
        this.sessionInfo.getUser().then(res => {
            this.user = res;
        });
    }
}
