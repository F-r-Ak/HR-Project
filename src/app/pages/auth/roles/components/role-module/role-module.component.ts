import { Component, inject, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ModulesService, PrimeCheckBoxComponent, PrimeInputTextComponent, RolesService, SubmitButtonsComponent } from '../../../../../shared';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';

@Component({
    selector: 'app-role-module',
    standalone: true,
    imports: [RouterModule, FormsModule, ReactiveFormsModule, CardModule,PrimeInputTextComponent,SubmitButtonsComponent,PrimeCheckBoxComponent],
    templateUrl: './role-module.component.html',
    styleUrl: './role-module.component.scss'
})
export class RoleModuleComponent extends BaseEditComponent implements OnInit {
    rolesService: RolesService = inject(RolesService);
    modulesService: ModulesService = inject(ModulesService);
    selectedModule: any;
    filteredModules: any[] = [];
    roleModules: any;
    moduleId: any;


 get rolePagePermissions() {
    return this.form.get('rolePagePermissions') as FormArray;
  }

  get pagePermissions() {
    return this.form.get('pagePermissions') as FormArray;
  }

    getPagePermissions(index: number): FormArray {
    //console.log('Check',(this.rolePagePermissions.at(index) as FormGroup).controls['pagePermissions'])
    return (this.rolePagePermissions.at(index) as FormGroup).controls['pagePermissions'] as FormArray;
  }

  getFormGroup(control: AbstractControl): FormGroup {
    //console.log('Check',control as FormGroup);
    return control as FormGroup;
  }
    constructor(override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

     override ngOnInit(): void {
        super.ngOnInit();
        this.pageType = this.activatedRoute.snapshot.data['pageType'];
        this.id = this.activatedRoute.snapshot.paramMap.get('id') as string;
        this.moduleId = this.activatedRoute.snapshot.paramMap.get('moduleId') as string;
        console.log(this.moduleId);
        console.log(this.id);
        this.getEditRoleModule();
        if (this.pageType === 'edit') {
    
        } else {
            this.initFormGroup();
        }
    }


    initFormGroup() {
        this.form = this.fb.group({
         
  id: [],
  roleId: [],
  nameAr: ['', Validators.required],
  nameEn: ['', Validators.required],
  moduleId: [null, Validators.required],
  moduleName: [{value:'',disabled:true}],
  rolePagePermissions: this.fb.array([])
});

    }

 checlAllPermissions(event: any, group: FormGroup, index: number) {

  const allSelectedValue = event?.checked ?? false;

  const pagePermissions = group.get('pagePermissions') as FormArray;

  pagePermissions.controls.forEach(control => {
    (control as FormGroup).get('isSelected')?.setValue(allSelectedValue);
  });

}

    getEditRoleModule = () => {
        this.rolesService.getRoleModule({ roleId: this.id, moduleId: this.moduleId }).subscribe((role: any) => {
            this.initFormGroup();
            
            // Set base form values
            this.form.patchValue({
                roleId: role.roleId,
                nameAr: role.nameAr,
                nameEn: role.nameEn,
                moduleName: role.moduleName,
                moduleId: role.moduleId
            });
            
            // Build rolePagePermissions FormArray
            const rolePagePermissionsArray = this.form.get('rolePagePermissions') as FormArray;
            role.rolePagePermissions.forEach((permission: any) => {
                const pagePermissionsArray = this.fb.array(
                    permission.pagePermissions.map((p: any) => 
                        this.fb.group({
                            name: [p.name],
                             isSelected: [p.isSelected ?? false]
                        })
                    )
                );
                
                const permissionGroup = this.fb.group({
                    page: [permission.page],
                    allSelected: [permission.allSelected],
                    pagePermissions: pagePermissionsArray
                });
                
                rolePagePermissionsArray.push(permissionGroup);
            });
            
            this.roleModules = role;
        });
    };

   
    getPageFormGroup(index: number): FormGroup {
        return this.rolePagePermissions.at(index) as FormGroup;
    }
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


//     checlAllPermissions(event: any, group: FormGroup, index: any) {
//   const allSelectedValue: boolean = event?.checked ?? false;
//   group.controls['allSelected'].setValue(allSelectedValue, { emitEvent: false });

//   const pagePermissionsList = (group.controls['pagePermissions'] as FormArray).controls;
//   pagePermissionsList.forEach(element => {
//     this.getFormGroup(element).controls['isSelected'].setValue(allSelectedValue);
//   });
// }

    onModuleSelect(event: any) {
        this.selectedModule = event.value;
        this.form.get('moduleId')?.setValue(this.selectedModule?.id);
    }



    /**
     * Compute `permissions` string for each page entry based on selected
     * pagePermissions (this is what the backend expects).
     */
    private normalizePermissions(formValue: any) {
        if (!formValue.rolePagePermissions) {
            return formValue;
        }

        const normalized = { ...formValue };
        normalized.rolePagePermissions = normalized.rolePagePermissions.map((rp: any) => {
            const names = (rp.pagePermissions || [])
                .filter((p: any) => p.isSelected)
                .map((p: any) => p.name);
            return {
                ...rp,
                permissions: names.length > 0 ? `[${names.join(',')}]` : '[]'
            };
        });
        return normalized;
    }
syncAllSelected(index: number) {

  const group = this.rolePagePermissions.at(index) as FormGroup;
  const permissions = group.get('pagePermissions') as FormArray;

  const selectedCount = permissions.controls.filter(control =>
    (control as FormGroup).get('isSelected')?.value === true
  ).length;

  const allSelected = selectedCount === permissions.length;

  group.get('allSelected')?.setValue(allSelected, { emitEvent: false });

}
 submit() {
        const payload = this.normalizePermissions(this.form.value);
        
        if (this.pageType === 'add') {
            this.rolesService.add(payload).subscribe(() => {
                this.alert.success('تم الإضافة بنجاح');
                this.redirect();
            });
        }
        if (this.pageType === 'edit') {
            this.rolesService.updateRoleModules({ roleId: this.id, ...payload }).subscribe(() => {
                this.alert.success('تم التحديث بنجاح');
                this.redirect();
            });
        }
    }

   
    override redirect() {
        this.router.navigate(['/pages/auth/roles']);
    }
}
