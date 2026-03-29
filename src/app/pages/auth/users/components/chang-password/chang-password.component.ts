import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { PrimeInputTextComponent, AccountService, PrimeAutoCompleteComponent

    } from '../../../../../shared';
import { ButtonModule } from 'primeng/button';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';

@Component({
  selector: 'app-chang-password',
  imports: [CardModule, CommonModule, FormsModule, ReactiveFormsModule, ButtonModule,PrimeAutoCompleteComponent,
          PrimeInputTextComponent, RouterModule],
   templateUrl: './chang-password.component.html',
  styleUrl: './chang-password.component.scss'
})
export class ChangPasswordComponent extends BaseEditComponent implements OnInit {
    accountService= inject(AccountService);
    dialogService: DialogService = inject(DialogService);
    selectedEmployee: any;
    filteredEmployees: any[] = [];
    selectedOrganization: any;
    filteredOrganizations: any[] = [];
    selectedRole: any;
    filteredRoles: any[] = [];
    organizationId: any;

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
        this.initFormGroup();
    }

    initFormGroup() {
        this.form = this.fb.group({
            oldPassword: ['', Validators.required],
            newPassword: ['', Validators.required],
            confirmPassword: ['', Validators.required],
        }, { validators: this.passwordMatchValidator });

    }

    getEditUser = () => {
        this.accountService.getEditUser(this.id).subscribe((user: any) => {
            this.initFormGroup();
            this.form.patchValue(user);
        });
    };


     handleChangePassword() {
    if (this.form.valid) {
      this.accountService.UpdateUserPassword(this.form.value ).subscribe({
        next: (res) => {
          localStorage.removeItem('accessToken');
          this.alert.success('تم  تغيرالرقم كلمة المرور بنجاح');
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          this.alert.error('خطا في تغير كلمة المرور ');
        }
      });
    }
  }
}
