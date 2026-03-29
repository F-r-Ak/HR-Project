import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { CardModule } from 'primeng/card';
import { TableOptions } from '../../../../../shared/interfaces';
import { AccountService } from '../../../../../shared';
import { PrimeDataTableComponent, PrimeDatepickerComponent, PrimeAutoCompleteComponent, PrimeTitleToolBarComponent } from '../../../../../shared';
import { AddEditModuleComponent } from '../../components/add-edit-module/add-edit-module.component';
@Component({
    selector: 'app-modules',
    imports: [RouterModule, FormsModule, ReactiveFormsModule, CardModule, PrimeDataTableComponent, PrimeTitleToolBarComponent],
    templateUrl: './modules.component.html',
    styleUrl: './modules.component.scss'
})
export class ModulesComponent extends BaseListComponent {
    tableOptions!: TableOptions;
    service = inject(AccountService);
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
                getAll: 'v1/authmodules/getpaged',
                getAllMethod: 'POST',
                delete: 'v1/authmodules/delete'
            },
            inputCols: this.initializeTableColumns(),
            inputActions: this.initializeTableActions(),
            permissions: {
                componentName: 'SYSTEM-MANAGEMENT-SMART-LOOKUPS-ACCIDENT-TYPES',
                allowAll: true,
                listOfPermissions: []
            },
            bodyOptions: {
                filter: {}
            },
            responsiveDisplayedProperties: ['email']
        };
    }

    initializeTableColumns(): TableOptions['inputCols'] {

        return [
              {
                field: 'nameAr',
                header: 'اسم الادارة ',
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
        this.openDialog(AddEditModuleComponent, 'اضافة إدارة', {
            pageType: 'add'
        });
    }

    openEdit(rowData: any) {
        this.openDialog(AddEditModuleComponent, 'تعديل  إدارة', {
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
