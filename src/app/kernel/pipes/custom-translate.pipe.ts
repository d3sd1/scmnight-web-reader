import {Pipe, PipeTransform} from '@angular/core';
import {CustomTranslatesService} from "../services/custom-translates.service";
import {User} from "../model/user";
import {SessionSingleton} from "../singletons/session.singleton";

@Pipe({
  name: 'cTranslate',
  pure: false
})
export class CustomTranslatePipe implements PipeTransform {
  constructor(private cTranslate: CustomTranslatesService) {

  }

  transform(key: string, langKey: string): string {
    return this.cTranslate.getTranslate(key, langKey);
  }
}
