import { Component, inject, OnInit } from '@angular/core';
import { NotificationsWidget } from './components/notificationswidget';
import { StatsWidget } from './components/statswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';
import { BestSellingWidget } from './components/bestsellingwidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';

import { CommonModule } from '@angular/common';
import { Carousel } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppInfo } from './components/appInfo';

interface Slider {
    name: string;
    image: string;
}

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, ButtonModule],
    template: `
        <div class="dashboardBackground d-flex">
            <div class="linearGradient d-flex justify-content-center align-items-center">
                <div class="dashboardInfo">
                    <img class="mb-4" src="" alt="لوجو" />

                    <p>مشروع</p>
                    <p></p>
                    <p></p>
                    <p></p>
                    <p></p>
                    <p>....</p>

                    <div class="d-flex justify-content-center align-items-center">
                        <button class="main-btn main" type="button" pButton pRipple (click)="openDialog()">
                            <div class="d-flex align-items-center">
                                <span class="p-inline-end-1">{{ 'المزيد من المعلومات' }}</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Dashboard implements OnInit {
    sliders: Slider[] = [];

    dialogRef: DynamicDialogRef | undefined;
    dialogService = inject(DialogService);

    constructor() {}

    ngOnInit() {
        this.sliders = [
            {
                name: 'slider1Image',
                image: 'slider1.png'
            },
            {
                name: 'slider2Image',
                image: 'slider2.png'
            },
            {
                name: 'slider3Image',
                image: 'slider3.png'
            }
        ];
    }

    openDialog(): void {
        // Add closable parameter with default value
        this.dialogRef = this.dialogService.open(AppInfo, {
            header: 'معلومات عن النظام',
            width: '45%',
            style: { 'background-color': 'var(--primary-color) !important', 'border-color': 'var(--primary-color) !importants', color: 'var(--white-color)' },
            modal: true,
            breakpoints: {
                '1199px': '75vw',
                '575px': '90vw'
            },
            // data: data,
            focusOnShow: false,
            autoZIndex: true,
            baseZIndex: 10000,
            dismissableMask: true,
            closable: true // Set the closable property
        });
    }
}
