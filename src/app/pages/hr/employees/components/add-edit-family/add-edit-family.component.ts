import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable, of, switchMap } from 'rxjs';
import {  } from '../../../../../shared/interfaces';
import { AddFamilyDto, EnumDto, UpdateFamilyDto } from '../../../../../shared/interfaces';
import { PrimeInputTextComponent, PrimeAutoCompleteComponent, PrimeDatepickerComponent, SubmitButtonsComponent, FamiliesService, FamilyRelationshipsService, QualificationsService, JobsService } from '../../../../../shared';
import { CardModule } from 'primeng/card';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-add-edit-family',
    standalone: true,
    imports: [ReactiveFormsModule, CardModule, TranslateModule, PrimeInputTextComponent, PrimeAutoCompleteComponent, PrimeDatepickerComponent, SubmitButtonsComponent],
    templateUrl: './add-edit-family.component.html',
    styleUrl: './add-edit-family.component.scss'
})
export class AddEditFamilyComponent implements OnInit {
    @Output() familySubmitted = new EventEmitter<string>();

    form!: FormGroup;
    pageType: 'add' | 'edit' = 'add';
    personId: string = '';
    familyId: string = '';

    familyRelationships: EnumDto[] = [];

    selectedFamilyRelationship: EnumDto | null = null;
    selectedQualification: any = null;
    selectedJob: any = null;

    private fb = inject(FormBuilder);
    private activatedRoute = inject(ActivatedRoute);
    private dialogConfig = inject(DynamicDialogConfig, { optional: true });
    private dialogRef = inject(DynamicDialogRef, { optional: true });
    familiesService = inject(FamiliesService);
    familyRelationshipsService = inject(FamilyRelationshipsService);
    qualificationsService = inject(QualificationsService);
    jobsService = inject(JobsService);

    ngOnInit(): void {
        if (this.dialogConfig?.data) {
            this.personId = this.dialogConfig.data.personId || '';
            this.familyId = this.dialogConfig.data.familyId || '';
        } else {
            this.personId = this.activatedRoute.snapshot.params['personId'] || '';
            this.familyId = this.activatedRoute.snapshot.params['familyId'] || '';
        }

        if (this.familyId) {
            this.pageType = 'edit';
        }

        this.initForm();
        this.loadDropdowns();
    }

    private initForm(): void {
        this.form = this.fb.group({
            fullName: [null, Validators.required],
            nationalID: [null, [Validators.required, Validators.pattern(/^[23]\d{13}$/)]],
            birthDate: [{ value: null, disabled: true }, Validators.required],
            familyRelationship: [null, Validators.required],
            qualificationId: [null],
            jobId: [null]
        });

        this.form.get('nationalID')?.valueChanges.subscribe((value: string) => {
            this.extractBirthDateFromNationalID(value);
        });
    }

    private extractBirthDateFromNationalID(nationalID: string): void {
        if (!nationalID || !/^[23]\d{13}$/.test(nationalID)) return;

        const century = nationalID[0] === '2' ? '19' : '20';
        const year = century + nationalID.substring(1, 3);
        const month = nationalID.substring(3, 5);
        const day = nationalID.substring(5, 7);

        const birthDate = new Date(Date.UTC(+year, +month - 1, +day));
        if (!isNaN(birthDate.getTime())) {
            this.form.get('birthDate')?.setValue(birthDate, { emitEvent: false });
        }
    }

    private loadDropdowns(): void {
        forkJoin({
            familyRelationships: this.familyRelationshipsService.familyRelationships
        }).subscribe(({ familyRelationships }) => {
            this.familyRelationships = familyRelationships;
            if (this.pageType === 'edit') {
                this.loadFamily();
            }
        });
    }

    private loadFamily(): void {
        this.familiesService.getEditFamily(this.familyId).pipe(
            switchMap((family) =>
                forkJoin({
                    family: of(family),
                    qualification: family.qualificationId ? this.qualificationsService.getQualification(family.qualificationId) : of(null),
                    job: family.jobId ? this.jobsService.getJob(family.jobId) : of(null)
                })
            )
        ).subscribe(({ family, qualification, job }) => {
            this.form.patchValue({ ...family });
            this.selectedFamilyRelationship = this.familyRelationships.find((f) => f.nameEn === family.familyRelationship) ?? null;
            this.selectedQualification = qualification ?? null;
            this.selectedJob = job ?? null;
        });
    }

    onEnumSelect(field: string, selectedKey: string, event: EnumDto) {
        this.form.get(field)?.setValue(event?.nameEn ?? null);
        (this as any)[selectedKey] = event;
    }

    onEnumClear(field: string, selectedKey: string) {
        this.form.get(field)?.setValue(null);
        (this as any)[selectedKey] = null;
    }

    onLookupSelect(field: string, selectedKey: string, event: any) {
        this.form.get(field)?.setValue(event?.id ?? null);
        (this as any)[selectedKey] = event;
    }

    onLookupClear(field: string, selectedKey: string) {
        this.form.get(field)?.setValue(null);
        (this as any)[selectedKey] = null;
    }

    enumGetMethod(list: EnumDto[]) {
        return (_body: any): Observable<any[]> => {
            const query: string = _body?.filter?.searchCriteria?.toLowerCase() ?? '';
            const filtered = query ? list.filter((i) => i.nameAr?.toLowerCase().includes(query)) : list;
            return of({ data: filtered, totalCount: filtered.length } as any);
        };
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const formValue = this.form.getRawValue();

        if (this.pageType === 'add') {
            const body: AddFamilyDto = { ...formValue, id: '', personId: this.personId };
            this.familiesService.add(body).subscribe((res) => {
                this.familySubmitted.emit(res.id ?? '');
                this.dialogRef?.close(res.id);
            });
        } else {
            const body: UpdateFamilyDto = { ...formValue, id: this.familyId, personId: this.personId };
            this.familiesService.update(body).subscribe(() => {
                this.familySubmitted.emit(this.familyId);
                this.dialogRef?.close(this.familyId);
            });
        }
    }

    onCancel(): void {
        this.form.reset();
        this.dialogRef?.close();
    }
}
