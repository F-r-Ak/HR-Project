import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PrimeAutoCompleteComponent, PrimeInputTextComponent, PersonsService } from './../../../../shared';
import { AlertService } from './../../../../core';

@Component({
    selector: 'app-report',
    imports: [RouterModule, FormsModule, ReactiveFormsModule, CardModule, PrimeAutoCompleteComponent, PrimeInputTextComponent, ButtonModule],
    templateUrl: './report.component.html',
    styleUrl: './report.component.scss'
})
export class ReportComponent implements OnInit {
    form!: FormGroup;

    private formBuilder = inject(FormBuilder);
    private personsService = inject(PersonsService);
    private alert = inject(AlertService);

    filteredPersons: any[] = [];
    reportTypes = [
        { label: 'PDF', value: 'pdf' },
        { label: 'Excel', value: 'excel' }
    ];
    isGeneratingReport = false;

    private readonly FILE_EXTENSIONS: Record<string, string> = {
        pdf: 'pdf',
        excel: 'xls'
    };

    ngOnInit(): void {
        this.initFormGroup();
    }

    initFormGroup(): void {
        this.form = this.formBuilder.group({
            PersonId: [''],
            NationalId: ['', Validators.required],
            reportName: ['PersonReport', [Validators.required, Validators.minLength(1)]],
            reportType: [null, Validators.required],
            acceptLanguage: ['ar', Validators.required]
        });
    }

    searchPersons(body: any) {
        return this.personsService.getPaged(body);
    }

    onPersonSelect(person: any): void {
        this.form.patchValue({ PersonId: person?.id ?? null });
    }

    onPersonClear(): void {
        this.form.patchValue({ PersonId: null });
    }

    onReportTypeSelect(reportType: any): void {
        this.form.patchValue({ reportType: reportType?.value ?? null });
    }

    searchReportTypes(event: any): void {
        const query = event.query.toLowerCase();
        this.reportTypes = [
            { label: 'PDF', value: 'pdf' },
            { label: 'Excel', value: 'excel' }
        ].filter((item) => item.label.toLowerCase().includes(query));
    }

    onExecute(): void {
        if (!this.form.get('PersonId')?.value && !this.form.get('NationalId')?.value) {
            this.alert.error('يرجى إدخال معرّف الشخص أو الرقم القومي');
            return;
        }

        if (!this.form.valid) {
            this.alert.error('يرجى التأكد من صحة البيانات المدخلة');
            this.markFormGroupTouched();
            return;
        }

        this.isGeneratingReport = true;
        const formData = this.getCleanedFormData();

        this.personsService.downloadReport(formData).subscribe({
            next: (blob: Blob) => {
                this.isGeneratingReport = false;
                this.triggerDownload(blob, formData.reportName, formData.reportType);
                this.alert.success('تم تحميل التقرير بنجاح');
            },
            error: (error: any) => {
                this.isGeneratingReport = false;
                this.alert.error(this.resolveErrorMessage(error));
            }
        });
    }

    onClear(): void {
        this.form.reset({
            reportName: 'PersonReport',
            reportType: null,
            acceptLanguage: 'ar'
        });
        this.filteredPersons = [];
    }

    private triggerDownload(blob: Blob, reportName: string, reportType: string): void {
        const extension = this.FILE_EXTENSIONS[reportType] ?? reportType;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${reportName}.${extension}`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

    private resolveErrorMessage(error: any): string {
        if (error.status === 500) return 'خطأ في الخادم: تحقق من صحة بيانات الشخص والرقم القومي';
        if (error.status === 404) return 'لم يتم العثور على البيانات المطلوبة';
        if (error.status === 400) return 'طلب غير صحيح - تحقق من البيانات المدخلة';
        return error.error?.message ?? error.message ?? 'حدث خطأ أثناء إنشاء التقرير';
    }

    private getCleanedFormData(): any {
        const raw = this.form.value;
        const cleaned: any = { reportName: 'PersonReport', reportType: 'pdf', acceptLanguage: 'ar' };
        Object.keys(raw).forEach((key) => {
            if (raw[key] !== null && raw[key] !== undefined && raw[key] !== '') {
                cleaned[key] = raw[key];
            }
        });
        return cleaned;
    }

    private markFormGroupTouched(): void {
        Object.values(this.form.controls).forEach((control) => control.markAsTouched());
    }
}
