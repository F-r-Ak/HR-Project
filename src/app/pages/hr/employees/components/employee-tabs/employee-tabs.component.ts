import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { StepsModule } from 'primeng/steps';
import { AddEditPersonComponent } from '../add-edit-person/add-edit-person.component';
import { AddEditEmploymentComponent } from '../add-edit-employment/add-edit-employment.component';
import { FamiliesComponent } from '../families/families.component';
import { JobHistoriesComponent } from '../job-histories/job-histories.component';
import { TrainingCoursesComponent } from '../training-courses/training-courses.component';
import { EmploymentsService } from '../../../../../shared';

@Component({
    selector: 'app-employee-tabs',
    standalone: true,
    imports: [StepsModule, RouterModule, AddEditPersonComponent, AddEditEmploymentComponent, FamiliesComponent, JobHistoriesComponent, TrainingCoursesComponent],
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
        { label: 'بيانات العائلة', disabled: true },
        { label: 'الخبرات الوظيفية', disabled: true },
        { label: 'الدورات التدريبية', disabled: true }
    ];

    private activatedRoute = inject(ActivatedRoute);
    private router = inject(Router);
    private employmentsService = inject(EmploymentsService);

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            this.personId = params['personId'] || null;
            this.employmentId = params['employmentId'] || null;
            this.isEditMode = !!this.personId;

            this.steps[1].disabled = !this.isEditMode;
            this.steps[2].disabled = !this.isEditMode;
            this.steps[3].disabled = !this.isEditMode;
            this.steps[4].disabled = !this.isEditMode;

            if (this.isEditMode && !this.employmentId) {
                this.employmentsService.getPaged({ filter: { personId: this.personId }, pageNumber: 1, pageSize: 1 }).subscribe((res) => {
                    const id = res?.data?.[0]?.id;
                    if (id) this.employmentId = id;
                });
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

    onEmploymentSubmitted(id?: string): void {
        if (id) this.employmentId = id;
        this.steps[2].disabled = false;
        this.steps[3].disabled = false;
        this.steps[4].disabled = false;
        this.activeStep = 2;
    }
}
