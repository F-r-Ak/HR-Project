import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        حقوق النشر محفوظة &copy; 2025
        <a href="" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">مركز نظم المعلومات والتحول الرقمي</a>
    </div>`
})
export class AppFooter {}
