import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { PickListModule } from 'primeng/picklist';
import { TableModule } from 'primeng/table';
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';
import { SubmitButtonsComponent, PrimeInputTextComponent, PagesService } from '../../../../../shared';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import { DialogService } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';

type Sort = 'asc' | 'desc';

@Component({
    selector: 'app-add-edit-page',
    standalone: true,
    imports: [CardModule, FormsModule, CommonModule, ReactiveFormsModule, SubmitButtonsComponent, PrimeInputTextComponent, PickListModule, TableModule, ChipModule, ButtonModule],
    templateUrl: './add-edit-page.component.html',
    styleUrl: './add-edit-page.component.scss'
})
export class AddEditPageComponent extends BaseEditComponent implements OnInit {
    pagesService= inject(PagesService);
    dialogService: DialogService = inject(DialogService);
    authModuleId = '';
    disabledPosition: boolean = true;
    disabledPositionCode: boolean = true;

    constructor(override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.dialogService.dialogComponentRefMap.forEach((element) => {
            this.pageType = element.instance.ddconfig.data.pageType;
            this.authModuleId = element.instance.ddconfig.data.authModuleId;
            if (this.pageType === 'edit') {
                this.id = element.instance.ddconfig.data.row.rowData.id; // Initialize organizationTeams directly from the passed data
                this.authModuleId = element.instance.ddconfig.data.row.rowData.authModuleId;
            }
        });

        this.initFormGroup();

        if (this.pageType === 'edit') {
            this.getEditPage();
        }
    }

    initPayloadForm = (): FormGroup => {
        return this.fb.group({
            toOrganizationId: [null, Validators.required],
            teamId: [[]]
        });
    };

    initFormGroup() {
        this.form = this.fb.group({
            id: [this.id],
            authModuleId: [this.authModuleId, Validators.required],
            nameAr: ['', Validators.required],
        });
    }



   getEditPage = () => {
        this.pagesService.getEditPage(this.id).subscribe((user: any) => {
            this.initFormGroup();
            this.form.patchValue(user);
        });
    };


    submit() {
        if (this.pageType === 'add') {
            this.pagesService.add(this.form.value).subscribe(() => {
                this.closeDialog();
            });
        }
        if (this.pageType === 'edit') {
            this.pagesService.update({ id: this.id, ...this.form.value }).subscribe(() => {
                this.closeDialog();
            });
        }
    }

    closeDialog() {
        this.dialogService.dialogComponentRefMap.forEach((dialog) => {
            dialog.destroy();
        });
    }
}
