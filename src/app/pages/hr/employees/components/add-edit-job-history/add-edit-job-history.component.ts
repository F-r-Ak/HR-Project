import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AddJobHistoryDto, UpdateJobHistoryDto } from '../../../../../shared/interfaces';
import {
    PrimeAutoCompleteComponent,
    PrimeDatepickerComponent,
    SubmitButtonsComponent,
    JobHistoriesService,
    OrganizationsService,
    JobsService,
    DepartmentsService
} from '../../../../../shared';
import { CardModule } from 'primeng/card';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-add-edit-job-history',
    standalone: true,
    imports: [ReactiveFormsModule, CardModule, TranslateModule, PrimeAutoCompleteComponent, PrimeDatepickerComponent, SubmitButtonsComponent],
    templateUrl: './add-edit-job-history.component.html',
    styleUrl: './add-edit-job-history.component.scss'
})
export class AddEditJobHistoryComponent implements OnInit {
    @Output() jobHistorySubmitted = new EventEmitter<string>();

    form!: FormGroup;
    pageType: 'add' | 'edit' = 'add';
    employmentId: string = '';
    jobHistoryId: string = '';

    selectedJob: any = null;
    selectedOrganization: any = null;
    selectedDepartment: any = null;

    private fb = inject(FormBuilder);
    private activatedRoute = inject(ActivatedRoute);
    private dialogConfig = inject(DynamicDialogConfig, { optional: true });
    private dialogRef = inject(DynamicDialogRef, { optional: true });
    jobHistoriesService = inject(JobHistoriesService);
    organizationsService = inject(OrganizationsService);
    jobsService = inject(JobsService);
    departmentsService = inject(DepartmentsService);

    ngOnInit(): void {
        if (this.dialogConfig?.data) {
            this.employmentId = this.dialogConfig.data.employmentId || '';
            this.jobHistoryId = this.dialogConfig.data.jobHistoryId || '';
        } else {
            this.employmentId = this.activatedRoute.snapshot.params['employmentId'] || '';
            this.jobHistoryId = this.activatedRoute.snapshot.params['jobHistoryId'] || '';
        }

        this.initForm();

        if (this.jobHistoryId) {
            this.pageType = 'edit';
            this.loadJobHistory();
        }
    }

    private initForm(): void {
        this.form = this.fb.group({
            jobId: [null, Validators.required],
            organizationId: [null, Validators.required],
            departmentId: [null],
            jobStartDate: [null, Validators.required],
            jobEndDate: [null]
        });
    }

    private loadJobHistory(): void {
        this.jobHistoriesService.getEditJobHistory(this.jobHistoryId).subscribe((jobHistory) => {
            this.form.patchValue({ ...jobHistory });
            if (jobHistory.jobId) this.jobsService.getJob(jobHistory.jobId).subscribe((j) => (this.selectedJob = j));
            if (jobHistory.organizationId) this.organizationsService.getOrganization(jobHistory.organizationId).subscribe((o) => (this.selectedOrganization = o));
            if (jobHistory.departmentId) this.departmentsService.getDepartment(jobHistory.departmentId).subscribe((d) => (this.selectedDepartment = d));
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

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const formValue = this.form.getRawValue();

        if (this.pageType === 'add') {
            const body: AddJobHistoryDto = { ...formValue, id: '', employmentId: this.employmentId };
            this.jobHistoriesService.add(body).subscribe((res) => {
                this.jobHistorySubmitted.emit(res.id ?? '');
                this.dialogRef?.close(res.id);
            });
        } else {
            const body: UpdateJobHistoryDto = { ...formValue, id: this.jobHistoryId, employmentId: this.employmentId };
            this.jobHistoriesService.update(body).subscribe(() => {
                this.jobHistorySubmitted.emit(this.jobHistoryId);
                this.dialogRef?.close(this.jobHistoryId);
            });
        }
    }

    onCancel(): void {
        this.form.reset();
        this.dialogRef?.close();
    }
}
