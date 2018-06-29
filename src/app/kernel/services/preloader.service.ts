import {Injectable} from '@angular/core';
import * as $ from "jquery";
@Injectable()
export class PreloaderService {
    start(transitionTime:number = 0)
    {
        $("#preloader").fadeIn(transitionTime);
    }
    stop(transitionTime:number = 0)
    {
        $("#preloader").fadeOut(transitionTime);
    }

  changeText(text: string) {
    $("#preloader > h1").text(text);
  }
}
