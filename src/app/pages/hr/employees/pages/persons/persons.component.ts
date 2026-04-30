import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { CardModule } from 'primeng/card';
import { TableOptions } from '../../../../../shared/interfaces';
import { PrimeDataTableComponent, PrimeTitleToolBarComponent, PersonsService } from '../../../../../shared';
import { AuthHelper } from '../../../../../core';

@Component({
    selector: 'app-persons',
    imports: [RouterModule, FormsModule, ReactiveFormsModule, CardModule, PrimeDataTableComponent, PrimeTitleToolBarComponent],
    templateUrl: './persons.component.html',
    styleUrl: './persons.component.scss'
})
export class PersonsComponent extends BaseListComponent {
    tableOptions!: TableOptions;
    service = inject(PersonsService);
    authHelper = inject(AuthHelper);
    formBuilder: FormBuilder = inject(FormBuilder);

    constructor(
        activatedRoute: ActivatedRoute,
        private router: Router
    ) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.initializeTableOptions();
    }

    initializeTableOptions() {
        this.tableOptions = {
            inputUrl: {
                getAll: 'v1/persons/getPaged',
                getAllMethod: 'POST',
                delete: 'v1/persons/delete'
            },
            inputCols: this.initializeTableColumns(),
            inputActions: this.initializeTableActions(),
            permissions: {
                componentName: 'HUMAN-RESOURCES-PERSONS',
                allowAll: true,
                listOfPermissions: []
            },
            bodyOptions: {
                filter: {}
            },
            responsiveDisplayedProperties: ['fullName', 'nationalID', 'birthDate', 'religion.nameAr', 'gender.nameAr', 'qualificationName', 'mobile']
        };
    }

    initializeTableColumns(): TableOptions['inputCols'] {
        return [
            {
                field: 'fullName',
                header: 'الاسم',
                filter: true,
                filterMode: 'text'
            },
            {
                field: 'nationalID',
                header: 'الرقم القومي',
                filter: true,
                filterMode: 'text'
            },
            {
                field: 'birthDate',
                header: 'تاريخ الميلاد',
                filter: true,
                filterMode: 'date'
            },
            {
                field: 'religion.nameAr',
                header: 'الديانة',
                filter: true,
                filterMode: 'text'
            },
            {
                field: 'gender.nameAr',
                header: 'النوع',
                filter: true,
                filterMode: 'text'
            },
            {
                field: 'qualificationName',
                header: 'المؤهل',
                filter: true,
                filterMode: 'text'
            },
            {
                field: 'mobile',
                header: 'الهاتف المحمول',
                filter: true,
                filterMode: 'text'
            }
        ];
    }

    initializeTableActions(): TableOptions['inputActions'] {
        return [
            {
                name: 'تعديل',
                icon: 'pi pi-file-edit',
                color: 'text-middle',
                isCallBack: true,
                call: (row: any) => {
                    if (row?.employmentId) {
                        this.router.navigate(['/pages/hr/employees/edit/', row?.id, row?.employmentId]);
                    } else {
                        this.router.navigate(['/pages/hr/employees/edit/', row?.id]);
                    }
                },
                allowAll: true
            },
            {
                name: 'حذف',
                icon: 'pi pi-trash',
                color: 'text-error',
                allowAll: true,
                isDelete: true
            }
        ];
    }

    override ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
