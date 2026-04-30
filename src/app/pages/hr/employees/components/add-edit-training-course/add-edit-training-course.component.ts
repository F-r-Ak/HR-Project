import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AddTrainingCourseDto, UpdateTrainingCourseDto } from '../../../../../shared/interfaces';
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

    form!: FormGroup;
    pageType: 'add' | 'edit' = 'add';
    employmentId: string = '';
    trainingCourseId: string = '';

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
        });
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const formValue = this.form.getRawValue();

        if (this.pageType === 'add') {
            const body: AddTrainingCourseDto = { ...formValue, id: '', employmentId: this.employmentId, attachs: [] };
            this.trainingCoursesService.add(body).subscribe((res) => {
                this.trainingCourseSubmitted.emit(res.id ?? '');
                this.dialogRef?.close(res.id);
            });
        } else {
            const body: UpdateTrainingCourseDto = { ...formValue, id: this.trainingCourseId, employmentId: this.employmentId, attachs: [] };
            this.trainingCoursesService.update(body).subscribe(() => {
                this.trainingCourseSubmitted.emit(this.trainingCourseId);
                this.dialogRef?.close(this.trainingCourseId);
            });
        }
    }

    onCancel(): void {
        this.form.reset();
        this.dialogRef?.close();
    }
}
