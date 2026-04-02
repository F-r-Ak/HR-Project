import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { SubmitButtonsComponent, PrimeInputTextComponent, OrganizationsService,MinistriesService, PrimeAutoCompleteComponent} from '../../../../../shared';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import { Lookup } from '../../../../../shared/interfaces';
@Component({
    selector: 'app-add-edit-organization',
    standalone: true,
    imports: [CardModule, CommonModule, FormsModule, ReactiveFormsModule, SubmitButtonsComponent, PrimeInputTextComponent , PrimeAutoCompleteComponent,],
    templateUrl: './add-edit-organization.component.html',
    styleUrl: './add-edit-organization.component.scss'
})
export class AddEditOrganizationComponent extends BaseEditComponent implements OnInit {
    organizationsService: OrganizationsService = inject(OrganizationsService);
    ministriesService: MinistriesService = inject(MinistriesService);
    dialogService: DialogService = inject(DialogService);



     selectedMinistry: any;
    filteredMinistries: Lookup[] = [];
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
            this.getEditFinancialDegree();
        } else {
            this.initFormGroup();
        }
    }

    initFormGroup() {
        this.form = this.fb.group({
            id: [],
            name: ['', Validators.required],
            code: ['', Validators.required],
            ministryId: [null, Validators.required]
        });
    }

    getEditFinancialDegree = () => {
        this.organizationsService.getEditOrganization(this.id).subscribe((city: any) => {
            this.initFormGroup();
            this.form.patchValue(city);
        });
    };
// getMinistries(event: any) {
//         const query = event.query.toLowerCase();
//         this.ministriesService.Ministries.subscribe({
//             next: (res) => {
//                 this.filteredMinistries = res.filter((item: any) => item.nameAr.toLowerCase().includes(query) || item.nameEn.toLowerCase().includes(query));
//             },
//             error: (err) => {
//                 this.alert.error('خطأ فى جلب انواع الجهات');
//             }
//         });
//     }

//      onMinistrySelect(event: any) {
//         this.selectedMinistry = event.value;
//         this.form.get('ministryId')?.setValue(this.selectedMinistry.id);
//     }
//      fetchMinistryDetails(ministryId: any) {
//         this.ministriesService.getMinistry(ministryId).subscribe((ministryDetails: any) => {
//             this.selectedMinistry = ministryDetails?.data || ministryDetails;
//             this.form.patchValue({
//                 ministryId: this.selectedMinistry?.id
//             });
//         });
//     }
    submit() {
        if (this.pageType === 'add')
            this.organizationsService.add(this.form.value).subscribe(() => {
                this.closeDialog();
            });
        if (this.pageType === 'edit')
            this.organizationsService.update({ id: this.id, ...this.form.value }).subscribe(() => {
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
