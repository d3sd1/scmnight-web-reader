import {Pipe, PipeTransform, NgZone, ChangeDetectorRef, OnDestroy} from "@angular/core";
import {TranslateService} from '@ngx-translate/core';
import {map} from "rxjs/operators";

@Pipe({
  name: 'timeAgo',
  pure: false
})
export class TimeAgoPipe implements PipeTransform, OnDestroy {
  private timer: number;

  constructor(private changeDetectorRef: ChangeDetectorRef, private ngZone: NgZone, private translate: TranslateService) {
  }

  transform(value: string) {
    this.removeTimer();
    let d = new Date(value);
    let now = new Date();
    let seconds = Math.round(Math.abs((now.getTime() - d.getTime()) / 1000));
    let timeToUpdate = (Number.isNaN(seconds)) ? 1000 : this.getSecondsUntilUpdate(seconds) * 1000;
    this.timer = this.ngZone.runOutsideAngular(() => {
      if (typeof window !== 'undefined') {
        return window.setTimeout(() => {
          this.ngZone.run(() => this.changeDetectorRef.markForCheck());
        }, timeToUpdate);
      }
      return null;
    });
    let minutes = Math.round(Math.abs(seconds / 60));
    let hours = Math.round(Math.abs(minutes / 60));
    let days = Math.round(Math.abs(hours / 24));
    let months = Math.round(Math.abs(days / 30.416));
    let years = Math.round(Math.abs(days / 365));
    let timeTranslate = "";
    if (Number.isNaN(seconds)) {
      return timeTranslate;
    } else if (seconds <= 45) {
      this.translate.get("time_ago.few_seconds_ago").subscribe((res: string) => {
        timeTranslate = res;
      });
      return timeTranslate;
    } else if (seconds <= 90) {
      this.translate.get("time_ago.a_minute_ago").subscribe((res: string) => {
        timeTranslate = res;
      });
      return timeTranslate;
    } else if (minutes <= 45) {
      this.translate.get("time_ago.x_minutes_ago").subscribe((res: string) => {
        timeTranslate = res.replace("{{minutes}}", String(minutes));
      });
      return timeTranslate;
    } else if (minutes <= 90) {
      this.translate.get("time_ago.an_hour_ago").subscribe((res: string) => {
        timeTranslate = res;
      });
      return timeTranslate;
    } else if (hours <= 22) {
      this.translate.get("time_ago.x_hours_ago").subscribe((res: string) => {
        timeTranslate = res.replace("{{hours}}", String(hours));
      });
      return timeTranslate;
    } else if (hours <= 36) {
      this.translate.get("time_ago.a_day_ago").subscribe((res: string) => {
        timeTranslate = res;
      });
      return timeTranslate;
    } else if (days <= 25) {
      this.translate.get("time_ago.x_days_ago").subscribe((res: string) => {
        timeTranslate = res.replace("{{days}}", String(days));
      });
      return timeTranslate;

    } else if (days <= 45) {
      this.translate.get("time_ago.a_month_ago").subscribe((res: string) => {
        timeTranslate = res;
      });
      return timeTranslate;
    } else if (days <= 345) {
      this.translate.get("time_ago.x_months_ago").subscribe((res: string) => {
        timeTranslate = res.replace("{{months}}", String(months));
      });
      return timeTranslate;
    } else if (days <= 545) {
      this.translate.get("time_ago.a_year_ago").subscribe((res: string) => {
        timeTranslate = res;
      });
      return timeTranslate;
    } else { // (days > 545)
      this.translate.get("time_ago.x_years_ago").subscribe((res: string) => {
        timeTranslate = res.replace("{{years}}", String(years));
      });
      return timeTranslate;
    }
  }

  ngOnDestroy(): void {
    this.removeTimer();
  }

  private removeTimer() {
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private getSecondsUntilUpdate(seconds: number) {
    let min = 60;
    let hr = min * 60;
    let day = hr * 24;
    if (seconds < min) { // less than 1 min, update every 2 secs
      return 2;
    } else if (seconds < hr) { // less than an hour, update every 30 secs
      return 30;
    } else if (seconds < day) { // less then a day, update every 5 mins
      return 300;
    } else { // update every hour
      return 3600;
    }
  }
}
