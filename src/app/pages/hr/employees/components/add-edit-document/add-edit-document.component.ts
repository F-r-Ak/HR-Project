import { Component, ElementRef, EventEmitter, inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of, switchMap } from 'rxjs';
import { Attachment } from '../../../../../shared/interfaces/attachment/attachment';
import {
    PrimeInputTextComponent,
    PrimeAutoCompleteComponent,
    SubmitButtonsComponent,
    DocumentsService,
    DocumentTypesService
} from '../../../../../shared';
import { AttachmentService } from '../../../../../shared/services/attachment/attachment.service';
import { CardModule } from 'primeng/card';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-add-edit-document',
    standalone: true,
    imports: [ReactiveFormsModule, CardModule, TranslateModule, PrimeInputTextComponent, PrimeAutoCompleteComponent, SubmitButtonsComponent],
    templateUrl: './add-edit-document.component.html',
    styleUrl: './add-edit-document.component.scss'
})
export class AddEditDocumentComponent implements OnInit {
    @Output() documentSubmitted = new EventEmitter<string>();
    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

    form!: FormGroup;
    pageType: 'add' | 'edit' = 'add';
    personId: string = '';
    documentId: string = '';

    selectedDocumentType: any = null;

    /** Newly selected files (not yet on server) */
    selectedFiles: File[] = [];
    /** Existing attachments loaded from server in edit mode */
    existingAttachments: Attachment[] = [];
    /** IDs of existing attachments marked for deletion */
    filesToDelete: string[] = [];

    private fb = inject(FormBuilder);
    private activatedRoute = inject(ActivatedRoute);
    private dialogConfig = inject(DynamicDialogConfig, { optional: true });
    private dialogRef = inject(DynamicDialogRef, { optional: true });
    documentsService = inject(DocumentsService);
    documentTypesService = inject(DocumentTypesService);
    attachmentService = inject(AttachmentService);

    ngOnInit(): void {
        if (this.dialogConfig?.data) {
            this.personId = this.dialogConfig.data.personId || '';
            this.documentId = this.dialogConfig.data.documentId || '';
        } else {
            this.personId = this.activatedRoute.snapshot.params['personId'] || '';
            this.documentId = this.activatedRoute.snapshot.params['documentId'] || '';
        }

        this.initForm();

        if (this.documentId) {
            this.pageType = 'edit';
            this.loadDocument();
        }
    }

    private initForm(): void {
        this.form = this.fb.group({
            documentTypeId: [null, Validators.required],
            documentNumber: [, Validators.required]
        });
    }

    private loadDocument(): void {
        this.documentsService.getEditDocument(this.documentId).pipe(
            switchMap((document) =>
                forkJoin({
                    document: of(document),
                    documentType: document.documentTypeId ? this.documentTypesService.getDocumentTypes(document.documentTypeId) : of(null)
                })
            )
        ).subscribe(({ document, documentType }) => {
            this.form.patchValue({ ...document });
            this.selectedDocumentType = documentType ?? null;
            this.existingAttachments = document.attachs ? [...document.attachs] : [];
        });
    }

    onLookupSelect(field: string, selectedKey: string, event: any) {
        this.form.get(field)?.setValue(event?.id ?? null);
        (this as any)[selectedKey] = event;
    }

    onLookupClear(field: string, selectedKey: string) {
        this.form.get(field)?.setValue(null);
        (this as any)[selectedKey] = null;
    }

    // ── File selection ──────────────────────────────────────────────────────────

    onFileChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (!input.files) return;
        Array.from(input.files).forEach((file) => {
            if (!this.selectedFiles.find((f) => f.name === file.name)) {
                this.selectedFiles.push(file);
            }
        });
        // reset so the same file can be re-selected after removal
        input.value = '';
    }

    removeNewFile(index: number): void {
        this.selectedFiles.splice(index, 1);
    }

    removeExistingAttachment(attachment: Attachment): void {
        const id = attachment.attachId || attachment.id;
        this.filesToDelete.push(id);
        this.existingAttachments = this.existingAttachments.filter((a) => a.id !== attachment.id);
    }

    // ── Submit ──────────────────────────────────────────────────────────────────

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        // Delete removed attachments first (fire-and-forget)
        this.filesToDelete.forEach((id) => this.attachmentService.deleteAttachment(id).subscribe());

        const formValue = this.form.getRawValue();
        const formData = new FormData();

        formData.append('id', this.pageType === 'edit' ? this.documentId : '');
        formData.append('personId', this.personId);
        formData.append('documentTypeId', formValue.documentTypeId ?? '');
        formData.append('documentNumber', formValue.documentNumber ?? '');

        this.selectedFiles.forEach((file) => formData.append('attachs', file, file.name));

        if (this.pageType === 'add') {
            this.documentsService.add(formData).subscribe((res) => {
                this.documentSubmitted.emit(res.id ?? '');
                this.dialogRef?.close(res.id);
            });
        } else {
            this.documentsService.update(formData).subscribe(() => {
                this.documentSubmitted.emit(this.documentId);
                this.dialogRef?.close(this.documentId);
            });
        }
    }

    onCancel(): void {
        this.form.reset();
        this.selectedFiles = [];
        this.existingAttachments = [];
        this.filesToDelete = [];
        this.dialogRef?.close();
    }

    getFileIcon(fileName: string): string {
        const ext = fileName.split('.').pop()?.toLowerCase();
        const icons: Record<string, string> = {
            pdf: 'pi pi-file-pdf',
            jpg: 'pi pi-image', jpeg: 'pi pi-image', png: 'pi pi-image',
            doc: 'pi pi-file-word', docx: 'pi pi-file-word',
            xls: 'pi pi-file-excel', xlsx: 'pi pi-file-excel'
        };
        return icons[ext ?? ''] ?? 'pi pi-file';
    }
}

