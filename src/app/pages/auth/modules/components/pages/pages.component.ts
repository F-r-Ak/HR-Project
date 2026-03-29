import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { CardModule } from 'primeng/card';
import { TableOptions } from '../../../../../shared/interfaces';
import { PagesService, PrimeDataTableComponent } from '../../../../../shared';
import { AddEditPageComponent } from '../add-edit-page/add-edit-page.component';

@Component({
    selector: 'app-pages',
    standalone: true,
    imports: [RouterModule, FormsModule, ReactiveFormsModule, CardModule, PrimeDataTableComponent],
    templateUrl: './pages.component.html',
    styleUrl: './pages.component.scss'
})
export class PagesComponent extends BaseListComponent {
    @Input() authModuleId: string | null = null;
    organizationId?: any;
    tableOptions!: TableOptions;
    service = inject(
        PagesService
    );
    formBuilder: FormBuilder = inject(FormBuilder);
    constructor(activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.initializeTableOptions();
    }

    initializeTableOptions() {
        this.tableOptions = {
            inputUrl: {
                getAll: 'v1/authpages/getpaged',
                getAllMethod: 'POST',
                delete: 'v1/authpages/delete'
            },
            inputCols: this.initializeTableColumns(),
            inputActions: this.initializeTableActions(),
            permissions: {
                componentName: 'SYSTEM-MANAGEMENT-SMART-ASSIGNMENT-ORGS',
                allowAll: true,
                listOfPermissions: []
            },
            bodyOptions: {
                filter: {
                    authModuleId: this.authModuleId
                }
            },
            responsiveDisplayedProperties: ['nameAr', 'teamNames']
        };
    }

    initializeTableColumns(): TableOptions['inputCols'] {
        return [
            {
                field: 'nameAr',
                header: 'اسم الشاشة',
                filter: true,
                filterMode: 'text'
            },
        ];
    }

    initializeTableActions(): TableOptions['inputActions'] {
        return [
            {
                name: 'EDIT',
                icon: 'pi pi-file-edit',
                color: 'text-middle',
                isCallBack: true,
                call: (row) => {
                    this.openEdit(row);
                },
                allowAll: true
            },
            {
                name: 'DELETE',
                icon: 'pi pi-trash',
                color: 'text-error',
                allowAll: true,
                isDelete: true
            }
        ];
    }

    openAdd() {
        this.openDialog(AddEditPageComponent, 'اضافة شاشة', {
            pageType: 'add',
            authModuleId: this.authModuleId
        });
    }

    openEdit(rowData: any) {
        this.openDialog(AddEditPageComponent, 'تعديل شاشة', {
            pageType: 'edit',
            row: { rowData }
        });
    }


    /* when leaving the component */
    override ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
