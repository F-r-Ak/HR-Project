import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { SubmitButtonsComponent, PrimeInputTextComponent, AccountService, PrimeAutoCompleteComponent, EmployeeService, OrganizationsService } from '../../../../../shared';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import { TabsModule } from 'primeng/tabs';
import { UserTabs } from '../../../../../core/enums/user-tabs';
import { UserRolesComponent } from '../user-roles/user-roles.component';

@Component({
    selector: 'app-add-edit-user',
    standalone: true,
    imports: [CardModule, CommonModule, FormsModule, ReactiveFormsModule, SubmitButtonsComponent, PrimeAutoCompleteComponent, TabsModule, PrimeInputTextComponent, UserRolesComponent],
    templateUrl: './add-edit-user.component.html',
    styleUrl: './add-edit-user.component.scss'
})
export class AddEditUserComponent extends BaseEditComponent implements OnInit {
    accountService: AccountService = inject(AccountService);
    employeeService = inject(EmployeeService);
    organizationsService = inject(OrganizationsService);
    dialogService: DialogService = inject(DialogService);
    selectedEmployee: any;
    filteredEmployees: any[] = [];
    selectedOrganization: any;
    filteredOrganizations: any[] = [];
    organizationId: any;
    userId: any;

    private passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        const newPassword = control.get('newPassword');
        const confirmPassword = control.get('confirmPassword');

        if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
            confirmPassword.setErrors({ passwordMismatch: true });
            return { passwordMismatch: true };
        }
        // Clear error if passwords match
        if (confirmPassword?.errors?.['passwordMismatch']) {
            confirmPassword.setErrors(null);
        }
        return null;
    };


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
            this.getEditUser();
            this.userId = this.activatedRoute.snapshot.paramMap.get('id') as string;
            console.log('User ID for edit:', this.userId);
        } else {
            this.initFormGroup();
        }
    }

    initFormGroup() {
        this.form = this.fb.group(
            {
                id: [],
                userName: [],
                password: [],
                email: [],
                organizationId: [],
                employeeId: [],
                oldPassword: [''],
                newPassword: [''],
                confirmPassword: ['']
            },
            { validators: this.passwordMatchValidator }
        );

        // Only require these fields in edit mode
        if (this.pageType === 'edit') {
            this.form.get('oldPassword')?.setValidators([Validators.required]);
            this.form.get('newPassword')?.setValidators([Validators.required]);
            this.form.get('confirmPassword')?.setValidators([Validators.required]);
        }
    }

    getEditUser = () => {
        this.accountService.getEditUser(this.id).subscribe((user: any) => {
            this.initFormGroup();
            this.form.patchValue(user);
            this.fetchOrganizationDetails(user?.organizationId);

        });
    };

//   if (organizationId) {
//             body.filter.organizationId = organizationId;
//             return this.organizationsService.getPaged(body);
//         }

      getOrganizations(event: any) {
    const query = event.query.toLowerCase();


    this.organizationsService.Organizations.subscribe({
        next: (res) => {



            this.filteredOrganizations = res.filter((organizationId: any) =>
                organizationId.nameAr.toLowerCase().includes(query)
            );
        },
        error: (err) => {
            this.alert.error('خطأ في جلب بيانات الجهات');
        }
    });
}


    onOrganizationSelect(event: any) {
        this.selectedOrganization = event.value;
        this.organizationId = this.selectedOrganization?.id;
        this.form.get('organizationId')?.setValue(this.selectedOrganization?.id);
        // this.disabledEmployee = false;
    }
    getEmployees(event: any) {
        const query = event.query.toLowerCase();
 this.organizationId= this.form.get('organizationId')?.value;

  console.log('Fetching employees for organization ID:', this.organizationId);
  const body: any = { filter: { organizationId: this.organizationId, search: query }, pageNumber: 1,  pageSize: 10 };
    this.employeeService.getPaged(body).subscribe({
        next: (res) => {

             this.filteredOrganizations = res.data;

            this.filteredEmployees = res.data.filter((employee: any) =>
                employee.nameAr.toLowerCase().includes(query)
            );
        },
        error: (err) => {
            this.alert.error('خطأ في جلب بيانات الموظفين');
        }
    });
}


    onEmployeeSelect(event: any) {
        this.selectedEmployee = event.value;
        this.form.get('employeeId')?.setValue(this.selectedEmployee?.id);
    }
    fetchOrganizationDetails(organizationId: any) {
        this.organizationsService.getOrganization(organizationId).subscribe((organizationDetails: any) => {
            this.selectedOrganization = organizationDetails?.data || organizationDetails;
            this.form.patchValue({
                organizationId: organizationDetails?.data?.id || organizationDetails?.id
            });
        });
    }



    get userEnum() {
        return UserTabs;
    }

    submit() {
        if (this.pageType === 'add')
            this.accountService.register(this.form.value).subscribe(() => {
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
        } else {
            super.redirect('/pages/auth/users');
        }
    };

 closeDialog() {
        this.dialogService.dialogComponentRefMap.forEach((dialog) => {
            dialog.destroy();
        });
    }
}
