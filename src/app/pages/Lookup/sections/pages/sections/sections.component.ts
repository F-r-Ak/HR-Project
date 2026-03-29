import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { CardModule } from 'primeng/card';
import { TableOptions } from '../../../../../shared/interfaces';
import { SectionsService } from '../../../../../shared';
import { PrimeDataTableComponent, PrimeDatepickerComponent, PrimeAutoCompleteComponent, PrimeTitleToolBarComponent } from '../../../../../shared';
import { AddEditSectionComponent } from '../../components/add-edit-section/add-edit-section.component';
import { AuthHelper } from '../../../../../core';
@Component({
    selector: 'app-sections',
    imports: [RouterModule, FormsModule, ReactiveFormsModule, CardModule, PrimeDataTableComponent, PrimeTitleToolBarComponent],
    templateUrl: './sections.component.html',
    styleUrl: './sections.component.scss'
})
export class SectionsComponent extends BaseListComponent {
    tableOptions!: TableOptions;
    service = inject(SectionsService);
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
                getAll: 'v1/sections/getpaged',
                getAllMethod: 'POST',
                delete: 'v1/sections/delete'
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
                header: ' اسم القطاع/الملف',
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
        this.openDialog(AddEditSectionComponent, 'اضافة قطاع', {
            pageType: 'add'
        });
    }

    openEdit(rowData: any) {
        this.openDialog(AddEditSectionComponent, 'تعديل  قطاع', {
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
