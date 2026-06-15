import { Component, ElementRef, EventEmitter, inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Attachment } from '../../../../../shared/interfaces/attachment/attachment';
import {
    PrimeInputTextComponent,
    PrimeDatepickerComponent,
    SubmitButtonsComponent,
    TrainingCoursesService
} from '../../../../../shared';
import { CardModule } from 'primeng/card';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-add-edit-training-course',
    standalone: true,
    imports: [ReactiveFormsModule, CardModule, TranslateModule, PrimeInputTextComponent, PrimeDatepickerComponent, SubmitButtonsComponent],
    templateUrl: './add-edit-training-course.component.html',
    styleUrl: './add-edit-training-course.component.scss'
})
export class AddEditTrainingCourseComponent implements OnInit {
    @Output() trainingCourseSubmitted = new EventEmitter<string>();
    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

    form!: FormGroup;
    pageType: 'add' | 'edit' = 'add';
    employmentId: string = '';
    trainingCourseId: string = '';

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
    trainingCoursesService = inject(TrainingCoursesService);

    ngOnInit(): void {
        if (this.dialogConfig?.data) {
            this.employmentId = this.dialogConfig.data.employmentId || '';
            this.trainingCourseId = this.dialogConfig.data.trainingCourseId || '';
        } else {
            this.employmentId = this.activatedRoute.snapshot.params['employmentId'] || '';
            this.trainingCourseId = this.activatedRoute.snapshot.params['trainingCourseId'] || '';
        }

        this.initForm();

        if (this.trainingCourseId) {
            this.pageType = 'edit';
            this.loadTrainingCourse();
        }
    }

    private initForm(): void {
        this.form = this.fb.group({
            courseName: [null, Validators.required],
            courseDescription: [null],
            courseStartDate: [null, Validators.required],
            courseEndDate: [null]
        });
    }

    private loadTrainingCourse(): void {
        this.trainingCoursesService.getEditTrainingCourse(this.trainingCourseId).subscribe((course) => {
            this.form.patchValue({ ...course });
            this.existingAttachments = course.attachs ? [...course.attachs] : [];
        });
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
        const attachId = attachment.attachId;
        this.filesToDelete.push(attachId);
        this.existingAttachments = this.existingAttachments.filter((a) => a.id !== attachment.id);
    }

    // ── Submit ──────────────────────────────────────────────────────────────────

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        // Delete removed attachments in a single batch call before saving
        if (this.filesToDelete.length) {
            this.trainingCoursesService.deleteAttachments(this.filesToDelete).subscribe();
        }

        const formValue = this.form.getRawValue();
        const formData = new FormData();

        formData.append('id', this.pageType === 'edit' ? this.trainingCourseId : '');
        formData.append('employmentId', this.employmentId);
        formData.append('courseName', formValue.courseName ?? '');
        formData.append('courseDescription', formValue.courseDescription ?? '');
        formData.append('courseStartDate', formValue.courseStartDate ? new Date(formValue.courseStartDate).toISOString() : '');
        formData.append('courseEndDate', formValue.courseEndDate ? new Date(formValue.courseEndDate).toISOString() : '');

        this.selectedFiles.forEach((file) => formData.append('attachs', file, file.name));

        if (this.pageType === 'add') {
            this.trainingCoursesService.add(formData).subscribe((res) => {
                this.trainingCourseSubmitted.emit(res.id ?? '');
                this.dialogRef?.close(res.id);
            });
        } else {
            this.trainingCoursesService.update(formData).subscribe(() => {
                this.trainingCourseSubmitted.emit(this.trainingCourseId);
                this.dialogRef?.close(this.trainingCourseId);
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
