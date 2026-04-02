import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { SubmitButtonsComponent, PrimeInputTextComponent, GovernmentsService } from '../../../../../shared';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';

@Component({
    selector: 'app-add-edit-document-type',
    standalone: true,
    imports: [CardModule, CommonModule, FormsModule, ReactiveFormsModule, SubmitButtonsComponent, PrimeInputTextComponent],
    templateUrl: './add-edit-document-type.component.html',
    styleUrl: './add-edit-document-type.component.scss'
})
export class AddEditDocumentTypeComponent extends BaseEditComponent implements OnInit {
    governmentsService: GovernmentsService = inject(GovernmentsService);
    dialogService: DialogService = inject(DialogService);

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
            this.getEditDocumentTypes();
        } else {
            this.initFormGroup();
        }
    }

    initFormGroup() {
        this.form = this.fb.group({
            id: [],
            name: ['', Validators.required],
            code: ['', Validators.required]
        });
    }

    getEditDocumentTypes = () => {
        this.governmentsService.getEditGovernment(this.id).subscribe((city: any) => {
            this.initFormGroup();
            this.form.patchValue(city);
        });
    };

    submit() {
        if (this.pageType === 'add')
            this.governmentsService.add(this.form.value).subscribe(() => {
                this.closeDialog();
            });
        if (this.pageType === 'edit')
            this.governmentsService.update({ id: this.id, ...this.form.value }).subscribe(() => {
                this.closeDialog();
            });
    }

    override redirect() {
        if (this.dialogService.dialogComponentRefMap.size > 0) {
            this.closeDialog();
        } else {
            const currentRoute = this.route.url;
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
