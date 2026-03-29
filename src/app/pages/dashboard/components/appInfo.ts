import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

@Component({
    standalone: true,
    selector: 'app-app-info',
    imports: [ButtonModule, MenuModule],
    template: ` <div>
        <div class="flex flex-column items-center justify-between text-center">
            <img src="assets/img/title (2).png" alt="title" />

            @for (item of items; track $index) {
                <div class="d-flex mb-1 mt-4">
                    <i class="pi pi-tag p-2"></i>

                    <p>{{ item.label }}</p>
                </div>

                @if (item.children) {
                    <ul class="list-disc pl-6 d-flex flex-column items-center justify-between ">
                        @for (child of item.children; track $index) {
                            <li class="mt-2" style="list-style-type:none">{{ child.label }}</li>
                        }
                    </ul>
                }
            }
        </div>
    </div>`
})
export class AppInfo {
    items = [
        { label: 'مشروع ميكنة العمل بمكتب السيد / نائب المحافظ', icon: 'pi pi-fw pi-plus' },
        {
            label: ' يعمل هذا النظام على اتمته و إدارة الأنشطة الإدارية الرئيسية التالية :',
            icon: 'pi pi-fw pi-trash',
            children: [
                { label: 'إدارة المراسلات (الوارد و الصادر )', icon: 'pi pi-fw pi-plus' },
                { label: ' إدارة الصادر ', icon: 'pi pi-fw pi-plus' },
                { label: 'إدارة الإجتماعات ', icon: 'pi pi-fw pi-plus' },
                { label: 'إدارة الزوار ', icon: 'pi pi-fw pi-plus' },
                { label: 'إدارة المواعيد (الاجندة)', icon: 'pi pi-fw pi-plus' },
                { label: 'متابعة تأشيرات و تكليفات السيد نائب المحافظ سواء متابعة ميدانية أو متابعة مكتبية', icon: 'pi pi-fw pi-plus' }
            ]
        },

        {
            label: 'المستفادين - أصحاب المصلحة من التطبيق :',
            icon: 'pi pi-fw pi-plus',
            children: [
                { label: ' نائب المحافظ ', icon: 'pi pi-fw pi-plus' },
                { label: ' مدير مكتب نائب المحافظ ', icon: 'pi pi-fw pi-plus' },
                { label: ' معاون نائب المحافظ ', icon: 'pi pi-fw pi-plus' },
                { label: ' السكرتارية الإدارية ', icon: 'pi pi-fw pi-plus' },
                { label: ' الجهات الداخلية و الخارجية (إدارت الديوان ، المديريات ، الوحدات المحلية) ', icon: 'pi pi-fw pi-plus' }
            ]
        }
    ];
}
