import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { SubmitButtonsComponent, PrimeInputTextComponent, SectionsService, RolesService, PrimeAutoCompleteComponent, ModulesService } from '../../../../../shared';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';

@Component({
    selector: 'app-add-edit-role',
    standalone: true,
    imports: [CardModule, CommonModule, FormsModule, ReactiveFormsModule, SubmitButtonsComponent, PrimeAutoCompleteComponent, PrimeInputTextComponent],
    templateUrl: './add-edit-role.component.html',
    styleUrl: './add-edit-role.component.scss'
})
export class AddEditRoleComponent extends BaseEditComponent implements OnInit {
    rolesService: RolesService = inject(RolesService);
    modulesService: ModulesService = inject(ModulesService);
    dialogService: DialogService = inject(DialogService);
    selectedModule: any;
    filteredModules: any[] = [];

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
            this.getEditRole();
        } else {
            this.initFormGroup();
        }
    }

    initFormGroup() {
        this.form = this.fb.group({
            id: [],
            nameAr: ['', Validators.required],
            nameEn: ['', Validators.required],
            moduleId: [null, Validators.required] 
        });
    }

    getEditRole = () => {
        this.rolesService.getRole(this.id).subscribe((role: any) => {
            this.initFormGroup();
            this.form.patchValue(role);
            this.fetchModuleDetails(role.moduleId);
        });
    };

    getModules(event: any) {
        const query = event.query.toLowerCase();
        this.modulesService.modules.subscribe({
            next: (res) => {
                this.filteredModules = res.filter((module: any) => module.nameAr.toLowerCase().includes(query));
            },
            error: (err) => {
                this.alert.error('خطأ فى جلب الادارات');
            }
        });
    }

    onModuleSelect(event: any) {
        this.selectedModule = event.value;
        this.form.get('moduleId')?.setValue(this.selectedModule?.id);
    }

    fetchModuleDetails(moduleId: any) {
        this.modulesService.modules.subscribe((response: any) => {
            this.filteredModules = Array.isArray(response) ? response : response.data || [];
            this.selectedModule = this.filteredModules.find((module: any) => module.id === moduleId);
            this.form.get('moduleId')?.setValue(this.selectedModule?.id);
        });
    }

    submit() {
        if (this.pageType === 'add')
            this.rolesService.add(this.form.value).subscribe(() => {
                this.closeDialog();
            });
        if (this.pageType === 'edit')
            this.rolesService.update({ id: this.id, ...this.form.value }).subscribe(() => {
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
