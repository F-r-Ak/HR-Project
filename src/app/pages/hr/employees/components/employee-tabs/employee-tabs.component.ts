import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { StepsModule } from 'primeng/steps';
import { AddEditPersonComponent } from '../add-edit-person/add-edit-person.component';
import { AddEditEmploymentComponent } from '../add-edit-employment/add-edit-employment.component';
import { EmployeeTabs } from '../../../../../core/enums/employee-tabs';
import { PersonsService } from '../../../../../shared';

@Component({
    selector: 'app-employee-tabs',
    standalone: true,
    imports: [
    CardModule,
    StepsModule,
    AddEditPersonComponent,
    AddEditEmploymentComponent,
    RouterModule
],
  templateUrl: './employee-tabs.component.html',
  styleUrl: './employee-tabs.component.scss'
})
export class EmployeeTabsComponent implements OnInit {
    correspondenceId: string | null = null;
    sentId: string | null = null;
    isEditMode: boolean = false;

    activeStep: number = 0;
    steps: MenuItem[] = [
        { label: 'بيانات الشخص' },
        { label: 'بيانات التوظيف', disabled: true },
        { label: 'بيانات العائلة', disabled: true },

    ];
    personsService = inject(PersonsService);
    private activatedRoute = inject(ActivatedRoute);

    get employeeTabsEnum() {
        return EmployeeTabs;
    }

    constructor() {}

    ngOnInit() {
        this.activatedRoute.params.subscribe(params => {
            this.correspondenceId = params['correspondenceId'] || null;
            this.sentId = params['sentId'] || null;

            if (this.correspondenceId && this.sentId) {
                this.isEditMode = true;
                this.steps[1].disabled = false;
            } else {
                this.isEditMode = false;
            }
        });
    }

    onCorrespondenceIdChange(id: string) {
        this.correspondenceId = id;
        this.steps[1].disabled = !id;
    }

    onCorrespondenceSubmitted() {
        if (this.correspondenceId || this.isEditMode) {
            this.activeStep = 1;
        }
    }

    onSentSubmitted() {
        // this.router.navigate(['/pages/correspondence/sent']);
        if (this.sentId || this.isEditMode) {
            this.activeStep = 2;
        }
    }

}
