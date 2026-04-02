import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { CardModule } from 'primeng/card';
import { PrimeDataTableComponent, PrimeTitleToolBarComponent, GovernmentsService, TableOptions } from '../../../../../shared';
import { AddEditGovernmentComponent } from '../../components/add-edit-government/add-edit-government.component';
import { AuthHelper } from '../../../../../core';
@Component({
    selector: 'app-governments',
    imports: [RouterModule, FormsModule, ReactiveFormsModule, CardModule, PrimeDataTableComponent, PrimeTitleToolBarComponent],
  templateUrl: './governments.component.html',
  styleUrl: './governments.component.scss'
})
export class GovernmentsComponent extends BaseListComponent {
    tableOptions!: TableOptions;
    service = inject(GovernmentsService);
    authHelper = inject(AuthHelper);
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
                getAll: 'v1/governments/getpaged',
                getAllMethod: 'POST',
                delete: 'v1/governments/delete'
            },
            inputCols: this.initializeTableColumns(),
            inputActions: this.initializeTableActions(),
            permissions: {
                componentName: 'HUMAN-RESOURCES-HIGHER-QUALIFICATIONS',
                allowAll: true,
                listOfPermissions: []
            },
            bodyOptions: {
                filter: {}
            },
            responsiveDisplayedProperties: ['code,name']
        };
    }

    initializeTableColumns(): TableOptions['inputCols'] {
        return [
            {
                field: 'code',
                header: 'الرمز',
                filter: true,
                filterMode: 'text'
            },
            {
                field: 'name',
                header: 'الادارة ',
                filter: true,
                filterMode: 'text'
            }
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
        this.openDialog(AddEditGovernmentComponent, 'اضافة  الجنسية ', {
            pageType: 'add'
        });
    }

    openEdit(rowData: any) {
        this.openDialog(AddEditGovernmentComponent, 'تعديل الجنسية ', {
            pageType: 'edit',
            row: { rowData }
        });
    }

    /* when leaving the component */
    override ngOnDestroy() {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
