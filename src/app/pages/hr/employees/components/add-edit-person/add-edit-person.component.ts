import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable, of, switchMap } from 'rxjs';
import { AddPersonDto, EnumDto, UpdatePersonDto } from '../../../../../shared/interfaces';
import { PersonsService } from '../../../../../shared/services/persons/persons.service';
import { GendersService } from '../../../../../shared/services/enums/genders/genders.service';
import { ReligionsService } from '../../../../../shared/services/enums/religions/religions.service';
import { MaritalStatusesService } from '../../../../../shared/services/enums/marital-statuses/marital-statuses.service';
import { MilitaryStatusesService } from '../../../../../shared/services/enums/military-statuses/military-statuses.service';
import { GovernmentsService } from '../../../../../shared/services/enums/governments/governments.service';
import { NationalitiesService } from '../../../../../shared/services/lookups/nationalities/nationalities.service';
import { QualificationsService } from '../../../../../shared/services/lookups/qualifications/qualifications.service';
import { HigherQualificationsService } from '../../../../../shared/services/lookups/higher-qualifications/higher-qualifications.service';
import { PrimeInputTextComponent, PrimeAutoCompleteComponent, PrimeDatepickerComponent, SubmitButtonsComponent } from '../../../../../shared';
import { CardModule } from 'primeng/card';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-add-edit-person',
    standalone: true,
    imports: [ReactiveFormsModule, CardModule, TranslateModule, PrimeInputTextComponent, PrimeAutoCompleteComponent, PrimeDatepickerComponent, SubmitButtonsComponent],
    templateUrl: './add-edit-person.component.html',
    styleUrl: './add-edit-person.component.scss'
})
export class AddEditPersonComponent implements OnInit {
    @Output() personSubmitted = new EventEmitter<string>();

    form!: FormGroup;
    pageType: 'add' | 'edit' = 'add';
    personId: string = '';

    genders: EnumDto[] = [];
    religions: EnumDto[] = [];
    maritalStatuses: EnumDto[] = [];
    militaryStatuses: EnumDto[] = [];
    governments: EnumDto[] = [];

    // selected objects for autocomplete (synced to form controls)
    selectedGender: EnumDto | null = null;
    selectedReligion: EnumDto | null = null;
    selectedMaritalStatus: EnumDto | null = null;
    selectedMilitaryStatus: EnumDto | null = null;
    selectedBirthGov: EnumDto | null = null;
    selectedNationality: any = null;
    selectedQualification: any = null;
    selectedHigherQualification: any = null;

    private fb = inject(FormBuilder);
    private activatedRoute = inject(ActivatedRoute);
    personsService = inject(PersonsService);
    gendersService = inject(GendersService);
    religionsService = inject(ReligionsService);
    maritalStatusesService = inject(MaritalStatusesService);
    militaryStatusesService = inject(MilitaryStatusesService);
    governmentsService = inject(GovernmentsService);
    nationalitiesService = inject(NationalitiesService);
    qualificationsService = inject(QualificationsService);
    higherQualificationsService = inject(HigherQualificationsService);

    ngOnInit(): void {
        this.personId = this.activatedRoute.snapshot.params['personId'] || '';
        if (this.personId) {
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
            birthGov: [null, Validators.required],
            birthPlace: [null],
            religion: [null, Validators.required],
            gender: [null, Validators.required],
            maritalStatus: [null],
            militaryStatus: [null],
            nationalityId: [null, Validators.required],
            qualificationId: [null],
            higherQualificationId: [null],
            currentAddress: [null, Validators.required],
            previousAddress: [null],
            homePhone: [null],
            officePhone: [null],
            mobile: [null, Validators.pattern(/^\d{11}$/)],
            email: [null, Validators.email],
            childrenNumber: [0]
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
            genders: this.gendersService.genders,
            religions: this.religionsService.religions,
            maritalStatuses: this.maritalStatusesService.maritalStatuses,
            militaryStatuses: this.militaryStatusesService.militaryStatuses,
            governments: this.governmentsService.governments
        }).subscribe(({ genders, religions, maritalStatuses, militaryStatuses, governments }) => {
            this.genders = genders;
            this.religions = religions;
            this.maritalStatuses = maritalStatuses;
            this.militaryStatuses = militaryStatuses;
            this.governments = governments;
            if (this.pageType === 'edit') this.loadPerson();
        });
    }

    private loadPerson(): void {
        this.personsService.getEditPerson(this.personId).pipe(
            switchMap((person) =>
                forkJoin({
                    person: of(person),
                    nationality: person.nationalityId ? this.nationalitiesService.getNationality(person.nationalityId) : of(null),
                    qualification: person.qualificationId ? this.qualificationsService.getQualification(person.qualificationId) : of(null),
                    higherQualification: person.higherQualificationId ? this.higherQualificationsService.getHigherQualification(person.higherQualificationId) : of(null)
                })
            )
        ).subscribe(({ person, nationality, qualification, higherQualification }) => {
            this.form.patchValue({ ...person });
            this.selectedGender = this.genders.find((g) => g.nameEn === person.gender) ?? null;
            this.selectedReligion = this.religions.find((r) => r.nameEn === person.religion) ?? null;
            this.selectedMaritalStatus = this.maritalStatuses.find((m) => m.nameEn === person.maritalStatus) ?? null;
            this.selectedMilitaryStatus = this.militaryStatuses.find((m) => m.nameEn === person.militaryStatus) ?? null;
            this.selectedBirthGov = this.governments.find((g) => g.nameEn === person.birthGov) ?? null;
            this.selectedNationality = nationality ?? null;
            this.selectedQualification = qualification ?? null;
            this.selectedHigherQualification = higherQualification ?? null;
        });
    }

    onEnumSelect(field: string, selectedKey: string, event: EnumDto) {
        (this as any)[selectedKey] = event;
        this.form.get(field)?.setValue(event?.nameEn ?? null);
    }

    onEnumClear(field: string, selectedKey: string) {
        (this as any)[selectedKey] = null;
        this.form.get(field)?.setValue(null);
    }

    onLookupSelect(field: string, selectedKey: string, event: any) {
        (this as any)[selectedKey] = event;
        this.form.get(field)?.setValue(event?.id ?? null);
    }

    onLookupClear(field: string, selectedKey: string) {
        (this as any)[selectedKey] = null;
        this.form.get(field)?.setValue(null);
    }

    // Wrap simple enum arrays as paginated-style response for autocomplete getMethod
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
            const body: AddPersonDto = { ...formValue, id: '' };
            this.personsService.add(body).subscribe((res) => {
                this.personSubmitted.emit(res.id ?? '');
            });
        } else {
            const body: UpdatePersonDto = { ...formValue, id: this.personId };
            this.personsService.update(body).subscribe(() => {
                this.personSubmitted.emit(this.personId);
            });
        }
    }

    onCancel(): void {
        this.form.reset();
    }
}
