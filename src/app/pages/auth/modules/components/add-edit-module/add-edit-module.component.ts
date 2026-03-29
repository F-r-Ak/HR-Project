import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { SubmitButtonsComponent, PrimeInputTextComponent, PrimeAutoCompleteComponent, EmployeeService, OrganizationsService, RolesService, ModulesService } from '../../../../../shared';
import { Lookup } from '../../../../../shared/interfaces';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import { TabsModule } from 'primeng/tabs';
import { PagesComponent } from '../pages/pages.component';
import { moduleTabs } from '../../../../../core/enums/module-tabs';

@Component({
    selector: 'app-add-edit-module',
    standalone: true,
    imports: [CardModule, CommonModule, FormsModule, ReactiveFormsModule, SubmitButtonsComponent, TabsModule, PagesComponent, PrimeInputTextComponent],
    templateUrl: './add-edit-module.component.html',
    styleUrl: './add-edit-module.component.scss'
})
export class AddEditModuleComponent extends BaseEditComponent implements OnInit {
    modulesService = inject(ModulesService);
    dialogService: DialogService = inject(DialogService);
    authModuleId: string = '';

    constructor(override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.dialogService.dialogComponentRefMap.forEach((element) => {
            this.pageType = element.instance.ddconfig.data.pageType;
            if (this.pageType === 'edit') {
                this.id = element.instance.ddconfig.data.row.rowData.id;
                this.authModuleId = this.id;
            }
        });
        if (this.pageType === 'edit') {
            this.getEditModule();
        } else {
            this.initFormGroup();
        }
    }

    initFormGroup() {
        this.form = this.fb.group({
            id: [],
            nameAr: ['', Validators.required]
        });
    }

    getEditModule = () => {
        this.modulesService.getEditModule(this.id).subscribe((user: any) => {
            this.initFormGroup();
            this.form.patchValue(user);
        });
    };

    get moduleTabsEnum() {
        return moduleTabs;
    }

    submit() {
        if (this.pageType === 'add')
            this.modulesService.add(this.form.value).subscribe(() => {
                this.closeDialog();
            });
        if (this.pageType === 'edit')
            this.modulesService.update({ id: this.id, ...this.form.value }).subscribe(() => {
                this.closeDialog();
            });
    }

    closeDialog() {
        this.dialogService.dialogComponentRefMap.forEach((dialog) => {
            dialog.destroy();
        });
    }
}
