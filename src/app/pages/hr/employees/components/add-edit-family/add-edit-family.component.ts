import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { AddFamilyDto, EnumDto, UpdateFamilyDto } from '../../../../../shared/interfaces';
import { FamiliesService } from '../../../../../shared/services/families/families.service';
import { FamilyRelationshipsService } from '../../../../../shared/services/enums/family-relationships/family-relationships.service';
import { QualificationsService } from '../../../../../shared/services/lookups/qualifications/qualifications.service';
import { JobsService } from '../../../../../shared/services/lookups/jobs/jobs.service';
import { PrimeInputTextComponent, PrimeAutoCompleteComponent, PrimeDatepickerComponent, SubmitButtonsComponent } from '../../../../../shared';
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
            birthDate: [null, Validators.required],
            familyRelationship: [null, Validators.required],
            qualificationId: [null],
            jobId: [null]
        });
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
        this.familiesService.getEditFamily(this.familyId).subscribe((family) => {
            this.form.patchValue({ ...family });
            this.selectedFamilyRelationship = this.familyRelationships.find((f) => f.nameEn === family.familyRelationship) ?? null;
            this.selectedQualification = family.qualificationId ? { id: family.qualificationId, nameAr: family.qualificationName } : null;
            this.selectedJob = family.jobId ? { id: family.jobId, nameAr: family.jobName } : null;
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
