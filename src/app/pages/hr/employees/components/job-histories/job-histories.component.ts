import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { PrimeDataTableComponent, PrimeTitleToolBarComponent, JobHistoriesService } from '../../../../../shared';
import { TableOptions } from '../../../../../shared/interfaces';
import { AddEditJobHistoryComponent } from '../add-edit-job-history/add-edit-job-history.component';

@Component({
    selector: 'app-job-histories',
    standalone: true,
    imports: [RouterModule, CardModule, PrimeDataTableComponent, PrimeTitleToolBarComponent],
    templateUrl: './job-histories.component.html',
    styleUrl: './job-histories.component.scss'
})
export class JobHistoriesComponent extends BaseListComponent implements OnInit {
    tableOptions!: TableOptions;
    service = inject(JobHistoriesService);
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
                getAll: 'v1/jobhistories/getpaged',
                getAllMethod: 'POST',
                delete: 'v1/jobhistories/delete'
            },
            inputCols: [
                { field: 'job', header: 'الوظيفة', filter: true, filterMode: 'text' },
                { field: 'organization', header: 'الجهة', filter: true, filterMode: 'text' },
                { field: 'department', header: 'الإدارة', filter: true, filterMode: 'text' },
                { field: 'jobStartDate', header: 'تاريخ البداية', filter: true, filterMode: 'date' },
                { field: 'jobEndDate', header: 'تاريخ النهاية', filter: true, filterMode: 'date' }
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
                componentName: 'HUMAN-RESOURCES-JOB-HISTORIES',
                allowAll: true,
                listOfPermissions: []
            },
            bodyOptions: {
                filter: { employmentId: this.employmentId }
            },
            responsiveDisplayedProperties: ['job', 'organization', 'jobStartDate', 'jobEndDate']
        };
    }

    openAddEditDialog(jobHistoryId?: string): void {
        this.openDialog(
            AddEditJobHistoryComponent,
            jobHistoryId ? 'تعديل السجل الوظيفي' : 'إضافة سجل وظيفي',
            { jobHistoryId: jobHistoryId ?? null, employmentId: this.employmentId }
        );
    }

    override ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
