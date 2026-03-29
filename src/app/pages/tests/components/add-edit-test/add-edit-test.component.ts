import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { SubmitButtonsComponent, PrimeInputTextComponent, TestsService, PrimeDatepickerComponent, PrimeAutoCompleteComponent, PrimeCheckBoxComponent, PrimeRadioButtonComponent } from '../../../../shared';
import { BaseEditComponent } from '../../../../base/components/base-edit-component';
import { DialogService } from 'primeng/dynamicdialog';

import { Lookup } from '../../../../shared/interfaces';

@Component({
    selector: 'app-add-edit-test',
    standalone: true,
    imports: [CardModule, CommonModule, FormsModule, ReactiveFormsModule, SubmitButtonsComponent,
         PrimeInputTextComponent, PrimeDatepickerComponent, PrimeAutoCompleteComponent,
          PrimeCheckBoxComponent, PrimeRadioButtonComponent],
    templateUrl: './add-edit-test.component.html',
    styleUrl: './add-edit-test.component.scss'
})
export class AddEditTestComponent extends BaseEditComponent implements OnInit {
    citiesService: TestsService = inject(TestsService);
    dialogService: DialogService = inject(DialogService);

    selectedCity: any;
    filteredCities: Lookup[] = [];

    constructor(override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.dialogService.dialogComponentRefMap.forEach((element) => {
            this.pageType = element.instance.ddconfig.data.pageType;
            if (this.pageType === 'edit') {
                this.id = element.instance.ddconfig.data.row.rowData.id;
            }
        });
        if (this.pageType === 'edit') {
            this.getEditCity();
        } else {
            this.initFormGroup();
        }
    }

    initFormGroup() {
        this.form = this.fb.group({
            id: [],
            cityId: [null],
            code: ['', Validators.required],
            nameEn: ['', Validators.required],
            nameAr: ['', Validators.required],
            lastMaintenanceDate: ['', Validators.required],
            isActive: [false, Validators.required],
            // color: ['red', Validators.required],
            color: ['', Validators.required]

        });
    }

    getEditCity = () => {
        this.citiesService.getEditCity(this.id).subscribe((city: any) => {
            this.initFormGroup();
            this.form.patchValue(city);
            this.fetchCityDetails(city.cityId);
        });
    };

    getCities(body: any) {
        return this.citiesService.getDropDown(body);
    }

    onCitySelect(event: any) {
        this.selectedCity = event.value;
        this.form.get('cityId')?.setValue(this.selectedCity.id);
    }

    fetchCityDetails(cityId: any) {
        this.citiesService.getcity(cityId).subscribe((cityDetails: any) => {
            this.selectedCity = cityDetails?.data || cityDetails;
            this.form.patchValue({
                cityId: cityDetails?.data?.id || cityDetails?.id
            });
        });
    }

    submit() {
        if (this.pageType === 'add')
            this.citiesService.add(this.form.value).subscribe(() => {
                this.closeDialog();
            });
        if (this.pageType === 'edit')
            this.citiesService.update({ id: this.id, ...this.form.value }).subscribe(() => {
                this.closeDialog();
            });
    }

    override redirect() {
        console.log('is new page dialogService ?', this.dialogService.dialogComponentRefMap.size);
        if (this.dialogService.dialogComponentRefMap.size > 0) {
            this.closeDialog();
        } else {
            const currentRoute = this.route.url;
            console.log('redirect to: ', currentRoute);
            const index = currentRoute.lastIndexOf('/');
            const str = currentRoute.substring(0, index);
            this.route.navigate([str]);
        }
    }

    closeDialog() {
        this.dialogService.dialogComponentRefMap.forEach((dialog) => {
            dialog.destroy();
        });
    }
}
