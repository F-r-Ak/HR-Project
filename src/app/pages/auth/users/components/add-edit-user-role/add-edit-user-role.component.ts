import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import {
    SubmitButtonsComponent,
    PrimeInputTextComponent,
    PrimeAutoCompleteComponent,
    PrimeCheckBoxComponent,
    PrimeDatepickerComponent,
    OrganizationsService,
    AccountService,
    RolesService,
} from '../../../../../shared';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-add-edit-user-role',
    standalone: true,
    imports: [CardModule, FormsModule, ReactiveFormsModule, SubmitButtonsComponent, PrimeInputTextComponent, PrimeAutoCompleteComponent, PrimeCheckBoxComponent, PrimeDatepickerComponent],
    templateUrl: './add-edit-user-role.component.html',
    styleUrl: './add-edit-user-role.component.scss'
})
export class AddEditUserRoleComponent extends BaseEditComponent implements OnInit {
    selectedOrganization: any;
    filteredOrganizations: any[] = [];
     selectedRole: any;
    filteredRoles: any[] = [];
    rolesService= inject(RolesService);
    organizationsService: OrganizationsService = inject(OrganizationsService);
    accountService = inject(AccountService);
    dialogService: DialogService = inject(DialogService);
    userId: any;

    constructor(override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }
  override ngOnInit(): void {
        super.ngOnInit();
        this.dialogService.dialogComponentRefMap.forEach((element) => {
            this.pageType = element.instance.ddconfig.data.pageType;
            this.userId = element.instance.ddconfig.data.row.userId;
            if (this.pageType === 'edit') {
                this.id = element.instance.ddconfig.data.row.rowData.id;
            }
        });
        if (this.pageType === 'edit') {
            // this.getEditMarinaOrganization();
        } else {
            this.initFormGroup();
        }
    }
    initFormGroup() {
        this.form = this.fb.group({
            id: [''],
            userId: [this.userId],
            roleId: ['', Validators.required],
        });
    }


  
    // getEditMarinaOrganization = () => {
    //     this.accountService.getEditUser(this.id).subscribe((MarinaOrganization: any) => {
    //         this.initFormGroup();
    //         this.form.patchValue(MarinaOrganization);
    //          this.fetchOrganizationDetails(MarinaOrganization); // this.fetchOrganizationDetails(MarinaOrganization.organizationId);
    //     });
    // };

    getRoles(event: any) {
        const query = event.query.toLowerCase();
        this.rolesService.roles.subscribe({
            next: (res) => {
                this.filteredRoles = res.filter((role: any) => role.nameAr.toLowerCase().includes(query));
            },
            error: (err) => {
                this.alert.error('خطأ فى جلب الصلاحيات');
            }
        });
    }

    onRoleSelect(event: any) {
        this.selectedRole = event.value;
        this.form.get('roleId')?.setValue(this.selectedRole?.id);
      
    }


        fetchRoleDetails(roleId: any) {
        this.rolesService.roles.subscribe((response: any) => {
            this.filteredRoles = Array.isArray(response) ? response : response.data || [];
            this.selectedRole = this.filteredRoles.find((role: any) => role.id === roleId);
            this.form.get('roleId')?.setValue(this.selectedRole?.id);
        });
    }
    submit() {
        if (this.pageType === 'add')
            this.accountService.addUserRole(this.form.value).subscribe(() => {
                this.closeDialog();
            });
        if (this.pageType === 'edit')
            this.accountService.update({ id: this.id, ...this.form.value }).subscribe(() => {
                this.closeDialog();
            });
    }
 override redirect = () => {
        if (this.dialogService.dialogComponentRefMap.size > 0) {
            this.closeDialog();
        } 
    };
    closeDialog() {
        this.dialogService.dialogComponentRefMap.forEach((dialog) => {
            dialog.destroy();
        });
    }
}
