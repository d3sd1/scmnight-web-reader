import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Bootstrap } from './app/kernel/bootstrap'
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import * as $ from 'jquery';
import  "reflect-metadata";

if (environment.production) {
    enableProdMode();
}
$(() => platformBrowserDynamic().bootstrapModule(Bootstrap));
