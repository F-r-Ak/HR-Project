import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { PrimeDataTableComponent, PrimeTitleToolBarComponent, TrainingCoursesService } from '../../../../../shared';
import { TableOptions } from '../../../../../shared/interfaces';
import { AddEditTrainingCourseComponent } from '../add-edit-training-course/add-edit-training-course.component';

@Component({
    selector: 'app-training-courses',
    standalone: true,
    imports: [RouterModule, CardModule, PrimeDataTableComponent, PrimeTitleToolBarComponent],
    templateUrl: './training-courses.component.html',
    styleUrl: './training-courses.component.scss'
})
export class TrainingCoursesComponent extends BaseListComponent implements OnInit {
    tableOptions!: TableOptions;
    service = inject(TrainingCoursesService);
    @Input() employmentId: string = '';

    constructor(activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.initializeTableOptions();
    }

    initializeTableOptions(): void {
        this.tableOptions = {
            inputUrl: {
                getAll: 'v1/trainingcourses/getpaged',
                getAllMethod: 'POST',
                delete: 'v1/trainingcourses/delete'
            },
            inputCols: [
                { field: 'courseName', header: 'اسم الدورة', filter: true, filterMode: 'text' },
                { field: 'courseDescription', header: 'وصف الدورة', filter: true, filterMode: 'text' },
                { field: 'courseStartDate', header: 'تاريخ البداية', filter: true, filterMode: 'date' },
                { field: 'courseEndDate', header: 'تاريخ النهاية', filter: true, filterMode: 'date' }
            ],
            inputActions: [
                {
                    name: 'تعديل',
                    icon: 'pi pi-file-edit',
                    color: 'text-middle',
                    isCallBack: true,
                    allowAll: true,
                    call: (row: any) => this.openAddEditDialog(row.id)
                },
                {
                    name: 'حذف',
                    icon: 'pi pi-trash',
                    color: 'text-error',
                    allowAll: true,
                    isDelete: true
                }
            ],
            permissions: {
                componentName: 'HUMAN-RESOURCES-TRAINING-COURSES',
                allowAll: true,
                listOfPermissions: []
            },
            bodyOptions: {
                filter: { employmentId: this.employmentId }
            },
            responsiveDisplayedProperties: ['courseName', 'courseStartDate', 'courseEndDate']
        };
    }

    openAddEditDialog(trainingCourseId?: string): void {
        this.openDialog(
            AddEditTrainingCourseComponent,
            trainingCourseId ? 'تعديل الدورة التدريبية' : 'إضافة دورة تدريبية',
            { trainingCourseId: trainingCourseId ?? null, employmentId: this.employmentId }
        );
    }

    override ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
