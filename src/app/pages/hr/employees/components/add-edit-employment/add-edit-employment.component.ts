import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of, switchMap } from 'rxjs';
import { AddEmploymentDto, UpdateEmploymentDto } from '../../../../../shared/interfaces';
import {
    PrimeInputTextComponent,
    PrimeAutoCompleteComponent,
    PrimeDatepickerComponent,
    SubmitButtonsComponent,
    EmploymentsService,
    OrganizationsService,
    JobsService,
    DepartmentsService,
    FinancialDegreesService
} from '../../../../../shared';
import { CardModule } from 'primeng/card';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-add-edit-employment',
    standalone: true,
    imports: [ReactiveFormsModule, CardModule, TranslateModule, PrimeInputTextComponent, PrimeAutoCompleteComponent, PrimeDatepickerComponent, SubmitButtonsComponent],
    templateUrl: './add-edit-employment.component.html',
    styleUrl: './add-edit-employment.component.scss'
})
export class AddEditEmploymentComponent implements OnInit {
    @Output() employmentSubmitted = new EventEmitter<string>();

    form!: FormGroup;
    pageType: 'add' | 'edit' = 'add';
    personId: string = '';
    employmentId: string = '';

    selectedEmploymentOrg: any = null;
    selectedCurrentDegree: any = null;
    selectedCurrentJob: any = null;
    selectedCurrentOrg: any = null;
    selectedCurrentDep: any = null;
    selectedSecondmentJob: any = null;
    selectedSecondmentOrg: any = null;
    selectedSecondmentDep: any = null;
    selectedNominatedJob: any = null;

    private fb = inject(FormBuilder);
    private activatedRoute = inject(ActivatedRoute);
    private dialogConfig = inject(DynamicDialogConfig, { optional: true });
    private dialogRef = inject(DynamicDialogRef, { optional: true });
    employmentsService = inject(EmploymentsService);
    organizationsService = inject(OrganizationsService);
    jobsService = inject(JobsService);
    departmentsService = inject(DepartmentsService);
    financialDegreesService = inject(FinancialDegreesService);

    ngOnInit(): void {
        if (this.dialogConfig?.data) {
            this.personId = this.dialogConfig.data.personId || '';
            this.employmentId = this.dialogConfig.data.employmentId || '';
        } else {
            this.personId = this.activatedRoute.snapshot.params['personId'] || '';
            this.employmentId = this.activatedRoute.snapshot.params['employmentId'] || '';
        }

        if (this.employmentId) {
            this.pageType = 'edit';
        }

        this.initForm();

        if (this.pageType === 'edit') {
            this.loadEmployment();
        }
    }

    private initForm(): void {
        this.form = this.fb.group({
            employmentOrgId: [null, Validators.required],
            employmentDate: [null, Validators.required],
            decisionNumber: [null, Validators.required],
            decisionDate: [null, Validators.required],
            currentDegreeId: [null],
            degreeDate: [null],
            insuranceNumber: [null],
            currentJobId: [null],
            currentOrgId: [null],
            currentDepId: [null],
            jobStartDate: [null],
            secondmentJobId: [null],
            secondmentOrgId: [null],
            secondmentDepId: [null],
            nominatedJobId: [null]
        });
    }

    private loadEmployment(): void {
        this.employmentsService.getEditEmployment(this.employmentId).pipe(
            switchMap((employment) =>
                forkJoin({
                    employment: of(employment),
                    employmentOrg: employment.employmentOrgId ? this.organizationsService.getOrganization(employment.employmentOrgId) : of(null),
                    currentDegree: employment.currentDegreeId ? this.financialDegreesService.getFinancialDegree(employment.currentDegreeId) : of(null),
                    currentJob: employment.currentJobId ? this.jobsService.getJob(employment.currentJobId) : of(null),
                    currentOrg: employment.currentOrgId ? this.organizationsService.getOrganization(employment.currentOrgId) : of(null),
                    currentDep: employment.currentDepId ? this.departmentsService.getDepartment(employment.currentDepId) : of(null),
                    secondmentJob: employment.secondmentJobId ? this.jobsService.getJob(employment.secondmentJobId) : of(null),
                    secondmentOrg: employment.secondmentOrgId ? this.organizationsService.getOrganization(employment.secondmentOrgId) : of(null),
                    secondmentDep: employment.secondmentDepId ? this.departmentsService.getDepartment(employment.secondmentDepId) : of(null),
                    nominatedJob: employment.nominatedJobId ? this.jobsService.getJob(employment.nominatedJobId) : of(null)
                })
            )
        ).subscribe(({ employment, employmentOrg, currentDegree, currentJob, currentOrg, currentDep, secondmentJob, secondmentOrg, secondmentDep, nominatedJob }) => {
            this.form.patchValue({ ...employment });
            this.selectedEmploymentOrg = employmentOrg ?? null;
            this.selectedCurrentDegree = currentDegree ?? null;
            this.selectedCurrentJob = currentJob ?? null;
            this.selectedCurrentOrg = currentOrg ?? null;
            this.selectedCurrentDep = currentDep ?? null;
            this.selectedSecondmentJob = secondmentJob ?? null;
            this.selectedSecondmentOrg = secondmentOrg ?? null;
            this.selectedSecondmentDep = secondmentDep ?? null;
            this.selectedNominatedJob = nominatedJob ?? null;
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
            const body: AddEmploymentDto = { ...formValue, id: '', personId: this.personId };
            this.employmentsService.add(body).subscribe((res) => {
                this.employmentSubmitted.emit(res.id ?? '');
                this.dialogRef?.close(res.id);
            });
        } else {
            const body: UpdateEmploymentDto = { ...formValue, id: this.employmentId, personId: this.personId };
            this.employmentsService.update(body).subscribe(() => {
                this.employmentSubmitted.emit(this.employmentId);
                this.dialogRef?.close(this.employmentId);
            });
        }
    }

    onCancel(): void {
        this.form.reset();
        this.dialogRef?.close();
    }
}

