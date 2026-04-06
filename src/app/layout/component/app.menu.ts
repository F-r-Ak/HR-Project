import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthHelper } from '../../core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];
    authHelper = inject(AuthHelper);
    private userSub?: Subscription;
    ngOnInit() {
        // Build menu initially
        this.buildModel();
        // Rebuild menu whenever user data changes (login/logout)
        this.userSub = this.authHelper.userData$.subscribe(() => {
            this.buildModel();
        });
    }

    ngOnDestroy(): void {
        this.userSub?.unsubscribe();
    }

    private buildModel(): void {
        this.model = [
            // this.authHelper.hasModule('ادمن') ?
            {
                label: 'الاعدادات',
                icon: 'pi pi-fw pi-briefcase',
                // routerLink: ['/pages'],
                items: [
                    {
                        label: 'الجنسيات',
                        icon: 'pi pi-fw pi-cog',
                        routerLink: ['/pages/settings/nationalities']
                    },
                    {
                        label: 'الوزارات',
                        icon: 'pi pi-fw pi-cog',
                        routerLink: ['/pages/settings/ministries']
                    },
                    {
                        label: 'الجهات',
                        icon: 'pi pi-fw pi-cog',
                        routerLink: ['/pages/settings/organizations']
                    },
                    {
                        label: 'الادارات',
                        icon: 'pi pi-fw pi-cog',
                        routerLink: ['/pages/settings/departments']
                    },
                    {
                        label: 'الوظائف',
                        icon: 'pi pi-fw pi-cog',
                        routerLink: ['/pages/settings/jobs']
                    },
                    {
                        label: 'الدرجات المالية',
                        icon: 'pi pi-fw pi-cog',
                        routerLink: ['/pages/settings/financial-degrees']
                    },
                    {
                        label: 'المؤهلات',
                        icon: 'pi pi-fw pi-cog',
                        routerLink: ['/pages/settings/qualifications']
                    },
                    {
                        label: 'المؤهلات العليا',
                        icon: 'pi pi-fw pi-cog',
                        routerLink: ['/pages/settings/higher-qualifications']
                    },
                    {
                        label: 'انواع الوثائق',
                        icon: 'pi pi-fw pi-cog',
                        routerLink: ['/pages/settings/document-types']
                    }
                ]
            },
            // : { styleClass: 'v' }
            {
                label: 'الموارد البشرية',
                icon: 'pi pi-fw pi-briefcase',
                // routerLink: ['/pages'],
                items: [
                    {
                        label: 'شئون الموظفين',
                        icon: 'pi pi-fw pi-cog',
                        routerLink: ['/pages/hr/employees']
                    }
                ]
            },
            this.authHelper.hasModule('ادمن')
                ? {
                      label: 'إدارة الصلاحيات',
                      icon: 'pi pi-fw pi-lock',
                      // routerLink: ['/pages'],
                      items: [
                          {
                              label: 'المستخدمين',
                              icon: 'pi pi-fw pi-user',
                              routerLink: ['/pages/auth/users']
                          },
                          {
                              label: 'الصلاحيات',
                              icon: 'pi pi-fw pi-lock',
                              routerLink: ['/pages/auth/roles']
                          },
                          {
                              label: 'الإدارات',
                              icon: 'pi pi-fw pi-sitemap',
                              routerLink: ['/pages/auth/modules']
                          }
                      ]
                  }
                : { styleClass: 'v' }
        ];
    }
}
