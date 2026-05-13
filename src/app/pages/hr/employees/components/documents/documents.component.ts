import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { PrimeDataTableComponent, PrimeTitleToolBarComponent, DocumentsService } from '../../../../../shared';
import { TableOptions } from '../../../../../shared/interfaces';
import { AddEditDocumentComponent } from '../add-edit-document/add-edit-document.component';

@Component({
    selector: 'app-documents',
    standalone: true,
    imports: [RouterModule, CardModule, PrimeDataTableComponent, PrimeTitleToolBarComponent],
    templateUrl: './documents.component.html',
    styleUrl: './documents.component.scss'
})
export class DocumentsComponent extends BaseListComponent implements OnInit {
    tableOptions!: TableOptions;
    service = inject(DocumentsService);
    @Input() personId: string = '';

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
                getAll: 'documents/getpaged',
                getAllMethod: 'POST',
                delete: 'documents/delete'
            },
            inputCols: [
                { field: 'documentTypeName', header: 'نوع الوثيقة', filter: true, filterMode: 'text' },
                { field: 'documentNumber', header: 'رقم الوثيقة', filter: true, filterMode: 'text' },
            {
                field: 'attachs',
                header: 'المرفق',
                filter: true,
                filterMode: 'attachments'
            }
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
                componentName: 'HUMAN-RESOURCES-DOCUMENTS',
                allowAll: true,
                listOfPermissions: []
            },
            bodyOptions: {
                filter: { personId: this.personId }
            },
            responsiveDisplayedProperties: ['documentTypeName', 'documentNumber', 'attachs']
        };
    }

    downloadAttachment(attachment: any): void {
        const url = typeof attachment === 'string' ? attachment : attachment?.path;
        if (url) {
            window.open(url, '_blank');
        }
    }

    openAddEditDialog(documentId?: string): void {
        this.openDialog(
            AddEditDocumentComponent,
            documentId ? 'تعديل وثيقة' : 'إضافة وثيقة',
            { documentId: documentId ?? null, personId: this.personId }
        );
    }

    override ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
