import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { Router, RouterModule } from '@angular/router';
import { FormGroup, Validators } from '@angular/forms';
import { PrimeInputTextComponent } from '../../../shared';
import { AccountService } from '../../../shared/services/account/account.service';
import { AuthHelper } from '../../../core';
import { BaseEditComponent } from '../../../base/components/base-edit-component';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, ReactiveFormsModule,RouterModule, RippleModule, PrimeInputTextComponent],
    templateUrl: './login.html',
     styleUrl: './login.scss'
})
export class Login extends BaseEditComponent  {
    formData: any;
    checked: boolean = false;

    auth = inject(AccountService);
    authHelper = inject(AuthHelper);
    override ngOnInit(): void {
        super.ngOnInit();
        this.initFormGroup();
    }

    initFormGroup() {
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    checkUserPermission(role: any) {
        // return Helper.hasAccessRole(role);
    }

    login() {
    console.log('form value: ', this.form.value);
        if (this.form.valid) {
            this.auth.login(this.form.value).subscribe({
                next: (res) => {
                    localStorage.setItem('accessToken', res.accessToken);
                    localStorage.setItem('refreshToken', res.refreshToken);
                    this.auth.tokenData.subscribe((tokenData: any) => {
                    const  organizationId=tokenData?.organizationId;
                    localStorage.setItem('tokenData', JSON.stringify(tokenData));
                    console.log('tokenData: ', tokenData);
                    localStorage.setItem('organizationId', organizationId);
                    // Notify AuthHelper so other components can react immediately
                    this.authHelper.setUserData(tokenData);
                    });

                    this.alert.success('تم تسجيل الدخول بنجاح');
                    this.router.navigate(['/dashboard']);

                    // if(this.checkUserPermission(PagesEnums.ADMIN)||this.checkUserPermission(PagesEnums.SUPER)){
                    //   this.router.navigate(['/apexchart']);
                    // }
                    // else if(this.checkUserPermission(PagesEnums.ORG)){
                },
                error: (err) => {
                    console.log('post err: ', err);
                    if (err) {
                        this.alert.error('خطا في تسجيل البيانات لا يمكنك الدخول');
                    }
                }
            });
        }
    }
}