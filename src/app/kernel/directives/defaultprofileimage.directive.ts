import {Directive, HostListener,ElementRef} from '@angular/core';

@Directive({
    selector: '[defaultProfileImage]'
})
export class DefaultProfileImageDirective {
    constructor(public el: ElementRef) { }
    @HostListener('error') onError() {
        $(this.el.nativeElement).hide().next(".user-navbar-default").hide();
        $(this.el.nativeElement).after('<i class="material-icons white-text user-navbar-default">face</i>');
    }
}