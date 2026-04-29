import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
    standalone: true,
    selector: 'app-app-info',
    imports: [ButtonModule],
    template: `
        <div>
            <div class="flex flex-column items-center justify-between text-center">
                <img src="assets/img/title (2).png" alt="title" />

                @for (item of items; track $index) {
                    <div class="d-flex mb-1 mt-4">
                        <i class="pi {{ item.icon }} p-2"></i>
                        <p>{{ item.label }}</p>
                    </div>

                    @if (item.children) {
                        <ul class="list-disc pl-6 d-flex flex-column items-center justify-between">
                            @for (child of item.children; track $index) {
                                <li class="mt-2" style="list-style-type: none">{{ child.label }}</li>
                            }
                        </ul>
                    }
                }
            </div>
        </div>
    `
})
export class AppInfo {
    items = [
        {
            label: 'نظام إدارة الموارد البشرية',
            icon: 'pi-users'
        },
        {
            label: 'يعمل هذا النظام على أتمتة وإدارة الأنشطة الرئيسية للموارد البشرية :',
            icon: 'pi-list',
            children: [
                { label: 'إدارة بيانات الموظفين' },
                { label: 'إدارة الوظائف والمسميات الوظيفية' },
                { label: 'إدارة الأقسام والهياكل التنظيمية' },
                { label: 'إدارة المؤهلات العلمية والمؤهلات العليا' },
                { label: 'إدارة الدرجات المالية' },
                { label: 'إدارة الجنسيات وأنواع الوثائق' },
                { label: 'إدارة الوزارات والجهات الحكومية' }
            ]
        },
        {
            label: 'المستفيدون من النظام :',
            icon: 'pi-id-card',
            children: [
                { label: 'مدير الموارد البشرية' },
                { label: 'موظفو إدارة الموارد البشرية' },
                { label: 'مسؤولو الأقسام والإدارات' },
                { label: 'مسؤولو تقنية المعلومات' },
                { label: 'الإدارة العليا' }
            ]
        },
        {
            label: 'صلاحيات النظام :',
            icon: 'pi-shield',
            children: [
                { label: 'إدارة المستخدمين والصلاحيات' },
                { label: 'تحديد الأدوار والوحدات الوظيفية' },
                { label: 'تسجيل الدخول الآمن بنظام JWT' }
            ]
        }
    ];
}
