import { Component, inject , OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule , Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BaseListComponent } from './../../../../base/components/base-list-component';
import { CardModule } from 'primeng/card';
import { PrimeDataTableComponent, PrimeTitleToolBarComponent, PersonsService, TableOptions, PrimeAutoCompleteComponent, PrimeInputTextComponent ,} from './../../../../shared';
import { ButtonModule } from 'primeng/button';
import { AuthHelper , AlertService,} from './../../../../core';
@Component({
    selector: 'app-report',
    imports: [RouterModule, FormsModule, ReactiveFormsModule, CardModule, PrimeDataTableComponent, PrimeTitleToolBarComponent , PrimeAutoCompleteComponent, PrimeInputTextComponent ,ButtonModule,],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent implements OnInit {
    form!: FormGroup;
    formBuilder = inject(FormBuilder);
    personsService = inject(PersonsService);
    // employeeService = inject(EmployeeService);
    // organizationsService = inject(OrganizationsService);
    // visitCasesService = inject(VisitCasesService);
    alert = inject(AlertService);
    authHelper = inject(AuthHelper);

    filteredEmployees: any[] = [];
    filteredOrganizations: any[] = [];
    filteredPersons: any[] = [];
    filteredVisitCases: any[] = [];
    reportTypes: any[] = [];
    acceptLanguages: any[] = [];
    isGeneratingReport: boolean = false;

    ngOnInit(): void {
        this.initFormGroup();
        this.initDropdowns();
    }

    initFormGroup() {
        this.form = this.formBuilder.group({
            PersonId: [''],
            NationalId: [''],
           
            reportName: ['PersonReport', [Validators.required, Validators.minLength(1)]],
            reportType: ['pdf', [Validators.required]],
            acceptLanguage: ['ar', [Validators.required]]
        });
    }

    initDropdowns() {
        this.reportTypes = [
            { label: 'PDF', value: 'pdf' },
            { label: 'Excel', value: 'excel' }
        ];
    }

    // searchEmployees(body: any) {
    //     return this.personsService.getPaged(body);
    // }

    // searchOrganizations(body: any) {
    //     return this.organizationsService.getPaged(body);
    // }

    searchPersons(body: any) {
        return this.personsService.getPaged(body);
    }

    // searchVisitCases(event: any) {
    //     const query = event.query.toLowerCase();
    //     this.visitCasesService.visitCases.subscribe({
    //         next: (res) => {
    //             this.filteredVisitCases = res.filter((visitCase: any) => visitCase.nameAr.toLowerCase().includes(query));
    //         },
    //         error: (err) => {
    //             this.alert.error('خطأ فى جلب بيانات حالات الزيارة');
    //         }
    //     });
    // }



    searchReportTypes(event: any) {
        const query = event.query.toLowerCase();
        this.reportTypes = [
            { label: 'PDF', value: 'pdf' },
            { label: 'Excel', value: 'excel' }
        ].filter(item => item.label.toLowerCase().includes(query));
    }

    onExecute() {
        // Validate that at least PersonId or NationalId is provided
        if (!this.form.get('PersonId')?.value && !this.form.get('NationalId')?.value) {
            this.alert.error('يرجى إدخال معرّف الشخص أو الرقم القومي');
            return;
        }

        if (this.form.valid) {
            this.isGeneratingReport = true;
            const formData = this.form.value;

            // Clean up the form data - remove empty values
            const cleanedData = this.cleanFormData(formData);

            // Log detailed request information for debugging
            console.log('=== Report Generation Request ===');
            console.log('Form Data:', formData);
            console.log('Cleaned Data:', cleanedData);
            console.log('API Endpoint:', `${this.personsService['domainName']}${this.personsService['baseUrl']}getreport`);
            console.log('Query Parameters:', this.buildQueryParamsDebug(cleanedData));
            console.log('=================================');

            // Since the API returns the file directly, use downloadReport
            this.personsService.downloadReport(cleanedData).subscribe({
                next: (blob: Blob) => {
                    this.isGeneratingReport = false;

                    // Create download link
                    const fileName = `${cleanedData.reportName}.${cleanedData.reportType}`;
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = fileName;
                    link.style.display = 'none';

                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    // Clean up
                    window.URL.revokeObjectURL(url);

                    this.alert.success('تم تحميل التقرير بنجاح');
                },
                error: (error: any) => {
                    this.isGeneratingReport = false;
                    console.error('=== Report Generation Error ===');
                    console.error('Status:', error.status);
                    console.error('Error:', error);
                    console.error('================================');

                    let errorMessage = 'حدث خطأ أثناء إنشاء التقرير';
                    
                    if (error.status === 500) {
                        errorMessage = 'خطأ في الخادم: تحقق من صحة بيانات الشخص والرقم القومي';
                    } else if (error.status === 404) {
                        errorMessage = 'لم يتم العثور على البيانات المطلوبة - تأكد من وجود الشخص في النظام';
                    } else if (error.status === 400) {
                        errorMessage = 'طلب غير صحيح - تحقق من البيانات المدخلة';
                    } else if (error.error?.message) {
                        errorMessage = error.error.message;
                    } else if (error.message) {
                        errorMessage = error.message;
                    }

                    this.alert.error(errorMessage);
                }
            });
        } else {
            this.alert.error('يرجى التأكد من صحة البيانات المدخلة');
            this.markFormGroupTouched();
        }
    }

    private buildQueryParamsDebug(body: any): any {
        const params: any = {};
        if (body.reportName) params.ReportName = body.reportName;
        if (body.reportType) params.ReportType = body.reportType;
        if (body.acceptLanguage) params.AcceptLanguage = body.acceptLanguage;
        if (body.PersonId) params.PersonId = body.PersonId;
        if (body.NationalId) params.NationalId = body.NationalId;
        return params;
    }

    private cleanFormData(formData: any): any {
        const cleaned: any = {};

        // Only include non-empty values
        Object.keys(formData).forEach(key => {
            const value = formData[key];
            if (value !== null && value !== undefined && value !== '') {
                cleaned[key] = value;
            }
        });

        // Ensure required fields have default values
        if (!cleaned.reportName) {
            cleaned.reportName = 'PersonReport';
        }
        if (!cleaned.reportType) {
            cleaned.reportType = 'pdf';
        }
        if (!cleaned.acceptLanguage) {
            cleaned.acceptLanguage = 'ar';
        }

        return cleaned;
    }

    private markFormGroupTouched(): void {
        Object.keys(this.form.controls).forEach(key => {
            const control = this.form.get(key);
            if (control) {
                control.markAsTouched();
            }
        });
    }

    onClear() {
        this.form.reset();
        // Reset to default values
        this.form.patchValue({
            reportName: 'PersonReport',
            reportType: 'pdf',
            acceptLanguage: 'ar'
        });
        // Clear filtered arrays
        this.filteredEmployees = [];
        this.filteredOrganizations = [];
        this.filteredVisitCases = [];
        this.filteredPersons = [];
        this.filteredPersons = [];
    }
}
