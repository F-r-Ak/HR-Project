import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { StepsModule } from 'primeng/steps';
import { AddEditPersonComponent } from '../add-edit-person/add-edit-person.component';
import { AddEditEmploymentComponent } from '../add-edit-employment/add-edit-employment.component';
import { AddEditFamilyComponent } from '../add-edit-family/add-edit-family.component';

@Component({
    selector: 'app-employee-tabs',
    standalone: true,
    imports: [StepsModule, RouterModule, AddEditPersonComponent, AddEditEmploymentComponent, AddEditFamilyComponent],
    templateUrl: './employee-tabs.component.html',
    styleUrl: './employee-tabs.component.scss'
})
export class EmployeeTabsComponent implements OnInit {
    personId: string | null = null;
    employmentId: string | null = null;
    isEditMode = false;

    activeStep = 0;
    steps: MenuItem[] = [
        { label: 'البيانات الشخصية' },
        { label: 'بيانات التوظيف', disabled: true },
        { label: 'بيانات العائلة', disabled: true }
    ];

    private activatedRoute = inject(ActivatedRoute);
    private router = inject(Router);

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            this.personId = params['personId'] || null;
            this.employmentId = params['employmentId'] || null;
            this.isEditMode = !!this.personId;

            this.steps[1].disabled = !this.isEditMode;
            this.steps[2].disabled = !this.isEditMode;

            if (this.isEditMode) {
                this.activeStep = 0;
            }
        });
    }

    onPersonIdChange(id: string): void {
        this.personId = id;
        this.steps[1].disabled = !id;
    }

    onPersonSubmitted(): void {
        if (this.personId || this.isEditMode) {
            if (!this.isEditMode && this.personId) {
                this.router.navigate(['../edit', this.personId], { relativeTo: this.activatedRoute });
            }
            this.activeStep = 1;
        }
    }

    onEmploymentSubmitted(): void {
        this.steps[2].disabled = false;
        this.activeStep = 2;
    }
}
