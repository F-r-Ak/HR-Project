import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { CardModule } from 'primeng/card';
import { TableOptions } from '../../../../../shared/interfaces';
import { SectionsService } from '../../../../../shared';
import { PrimeDataTableComponent, PrimeAutoCompleteComponent, PrimeTitleToolBarComponent } from '../../../../../shared';
import { AddEditRoleComponent } from '../../components/add-edit-role/add-edit-role.component';
import { RoleModuleComponent } from '../../components/role-module/role-module.component';
import { AuthHelper } from '../../../../../core';
@Component({
    selector: 'app-roles',
    imports: [RouterModule, FormsModule, ReactiveFormsModule, CardModule, PrimeDataTableComponent, PrimeTitleToolBarComponent],
    templateUrl: './roles.component.html',
    styleUrl: './roles.component.scss'
})
export class RolesComponent extends BaseListComponent {
    tableOptions!: TableOptions;
    service = inject(SectionsService);
    authHelper = inject(AuthHelper);
    formBuilder: FormBuilder = inject(FormBuilder);
    constructor(activatedRoute: ActivatedRoute, private router: Router) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.initializeTableOptions();
    }

    initializeTableOptions() {
        this.tableOptions = {
            inputUrl: {
                getAll: 'roles/getpaged',
                getAllMethod: 'POST',
                delete: 'roles/delete'
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
            responsiveDisplayedProperties: ['nameAr']
        };
    }

    initializeTableColumns(): TableOptions['inputCols'] {
        return [
            {
                field: 'nameAr',
                header: 'اسم الصلاحية',
                filter: true,
                filterMode: 'text'
            },
            {
                field: 'moduleName',
                header: 'اسم الإدارة',
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
                name: 'Settings',
                icon: 'pi pi-cog',
                color: 'text-middle',
                isCallBack: true,
                call: (row) => {
                    this.openRoleModule(row);
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
        this.openDialog(AddEditRoleComponent, 'اضافة صلاحية', {
            pageType: 'add'
        });
    }

    openEdit(rowData: any) {
        this.openDialog(AddEditRoleComponent, 'تعديل  صلاحية', {
            pageType: 'edit',
            row: { rowData }
        });
    }
    
    openRoleModule(rowData: any) {
        this.router.navigate(['settings', rowData.id,rowData.moduleId], { relativeTo: this.activatedRoute });

    }

    /* when leaving the component */
    override ngOnDestroy() {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
