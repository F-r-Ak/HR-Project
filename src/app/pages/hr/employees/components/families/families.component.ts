import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { PrimeDataTableComponent, PrimeTitleToolBarComponent, FamiliesService } from '../../../../../shared';
import { TableOptions } from '../../../../../shared/interfaces';
import { AddEditFamilyComponent } from '../add-edit-family/add-edit-family.component';

@Component({
    selector: 'app-families',
    standalone: true,
    imports: [RouterModule, CardModule, PrimeDataTableComponent, PrimeTitleToolBarComponent],
    templateUrl: './families.component.html',
    styleUrl: './families.component.scss'
})
export class FamiliesComponent extends BaseListComponent implements OnInit {
    tableOptions!: TableOptions;
    service = inject(FamiliesService);
    personId: string = '';

    constructor(activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        this.personId = this.activatedRoute.snapshot.params['personId'] || '';
        super.ngOnInit();
        this.initializeTableOptions();
    }

    initializeTableOptions(): void {
        this.tableOptions = {
            inputUrl: {
                getAll: 'v1/families/getpaged',
                getAllMethod: 'POST',
                delete: 'v1/families/delete'
            },
            inputCols: [
                { field: 'fullName', header: 'الاسم بالكامل', filter: true, filterMode: 'text' },
                { field: 'nationalID', header: 'الرقم القومي', filter: true, filterMode: 'text' },
                { field: 'birthDate', header: 'تاريخ الميلاد', filter: true, filterMode: 'date' },
                { field: 'familyRelationship.nameAr', header: 'صلة القرابة', filter: true, filterMode: 'text' },
                { field: 'qualificationName' , header: 'المؤهل', filter: true, filterMode: 'text' },
                { field: 'jobName', header: 'الوظيفة', filter: true, filterMode: 'text' }
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
                componentName: 'HUMAN-RESOURCES-FAMILIES',
                allowAll: true,
                listOfPermissions: []
            },
            bodyOptions: {
                filter: { personId: this.personId }
            },
            responsiveDisplayedProperties: ['fullName', 'nationalID', 'birthDate', 'familyRelationship.nameAr']
        };
    }

    openAddEditDialog(familyId?: string): void {
        this.openDialog(
            AddEditFamilyComponent,
            familyId ? 'تعديل بيانات العائلة' : 'إضافة فرد عائلة',
            { familyId: familyId ?? null, personId: this.personId }
        );
    }

    override ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}

