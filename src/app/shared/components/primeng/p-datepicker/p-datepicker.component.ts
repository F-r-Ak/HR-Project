import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ValidationHandlerPipe } from '../../../pipes';
import { NgClass } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-prime-datepicker',
  standalone: true,
  imports: [
    TranslateModule,
    DatePickerModule,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    ValidationHandlerPipe
  ],
  templateUrl: './p-datepicker.component.html',
  styleUrl: './p-datepicker.component.scss'
})
export class PrimeDatepickerComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() controlName = '';
  @Input() minDate: Date | undefined;
  @Input() maxDate: Date | undefined;
  @Input() mode: 'date' | 'time' | 'datetime' = 'date';
  @Input() referenceControlName = '';
  @Input() rangeMaxControlName = '';
  @Input() label = 'Date';
  @Input() utcMode: boolean = true;
  @Input() showIcon: boolean = true;
  @Input() showButtonBar: boolean = true;

  @Input() set disabled(value: boolean) {
    if (this.formGroup && this.controlName) {
      const control = this.formGroup.get(this.controlName);
      if (control) {
        if (value) {
          control.disable();
        } else {
          control.enable();
        }
      }
    }
  }

  currentValue: Date | null = null;
  dateFormat: string = '';
  showTimePicker: boolean = false;
  timeOnlyMode: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.configurePickerMode();
    // Automatically disable UTC mode for time-only fields to prevent timezone conversion
    if (this.mode === 'time') {
      this.utcMode = false;
    }
    this.setCurrentValue();
    this.setupValidation();
    this.setupValueChanges();
  }

  private configurePickerMode(): void {
    switch (this.mode) {
      case 'time':
        this.dateFormat = 'HH:mm';
        this.showTimePicker = true;
        this.timeOnlyMode = true;
        break;
      case 'datetime':
        this.dateFormat = 'dd/mm/yy HH:mm';
        this.showTimePicker = true;
        this.timeOnlyMode = false;
        break;
      case 'date':
      default:
        this.dateFormat = 'dd/mm/yy';
        this.showTimePicker = false;
        this.timeOnlyMode = false;
        break;
    }
  }

  private setCurrentValue(): void {
    if (this.formGroup?.get(this.controlName)?.value) {
      const value = this.formGroup.get(this.controlName)?.value;
      this.currentValue = this.parseInputDate(value);
    } else {
      this.currentValue = null;
    }
  }

  private parseInputDate(value: string | Date): Date {
    if (!value) return new Date();

    if (typeof value === 'string') {
      if (this.mode === 'time') {
        // For time-only mode, don't apply timezone conversion
        const [hours, minutes, seconds] = value.split(':').map(Number);
        const dummyDate = new Date(2000, 0, 1, hours || 0, minutes || 0, seconds || 0);
        return dummyDate;
      } else if (value.includes('T')) {
        const date = new Date(value);
        return this.utcMode ? this.convertToUTCDate(date) : date;
      } else {
        const parts = value.split('/');
        if (parts.length === 3) {
            const [day, month, year] = parts.map(Number);
            return this.utcMode
            ? new Date(Date.UTC(year, month - 1, day))
            : new Date(year, month - 1, day);
        }
        return new Date(value);
      }
    }

    // For time-only mode, don't apply UTC conversion to Date objects either
    if (this.mode === 'time') {
      return new Date(value);
    }

    return this.utcMode ? this.convertToUTCDate(value) : new Date(value);
  }

  private convertToUTCDate(date: Date): Date {
    return new Date(Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    ));
  }

  private setupValueChanges(): void {
    this.formGroup?.get(this.controlName)?.valueChanges.subscribe(val => {
      // Skip timezone conversion for time-only mode
      if (val && this.utcMode && (this.mode === 'date' || this.mode === 'datetime')) {
        this.handleTimezoneConversion();
      }
    });
  }

  private handleTimezoneConversion(): void {
    const control = this.formGroup.get(this.controlName);
    if (!control?.value) return;

    const dateValue = this.parseInputDate(control.value);
    const currentTime = control.value instanceof Date ? control.value.getTime() : null;

    if (this.mode === 'date') {
      const utcDate = new Date(Date.UTC(
        dateValue.getFullYear(),
        dateValue.getMonth(),
        dateValue.getDate()
      ));
      if (currentTime !== utcDate.getTime()) {
        control.setValue(utcDate, { emitEvent: false });
        this.currentValue = utcDate;
      }
    } else if (this.mode === 'datetime' && this.utcMode) {
      const utcDate = this.convertToUTCDate(dateValue);
      if (currentTime !== utcDate.getTime()) {
        control.setValue(utcDate, { emitEvent: false });
        this.currentValue = utcDate;
      }
    }
  }

  private setupValidation(): void {
    if (this.formGroup && this.controlName) {
      const control = this.formGroup.get(this.controlName);
      const referenceControl = this.referenceControlName ? this.formGroup.get(this.referenceControlName) : null;
      const maxReferenceControl = this.rangeMaxControlName ? this.formGroup.get(this.rangeMaxControlName) : null;

      if (control) {
        // Validator to ensure value lies within [minDate, maxDate]
        const rangeValidator = (c: AbstractControl): ValidationErrors | null => {
          if (!c.value) return null;

          const dateVal = this.parseInputDate(c.value);
          const minVal = this.minDate ? new Date(this.minDate) : null;
          const maxVal = this.maxDate ? new Date(this.maxDate) : null;

          // Handle date-only comparison
          if (this.mode === 'date') {
            if (this.utcMode) {
              dateVal.setUTCHours(0, 0, 0, 0);
              if (minVal) minVal.setUTCHours(0, 0, 0, 0);
              if (maxVal) maxVal.setUTCHours(23, 59, 59, 999);
            } else {
              dateVal.setHours(0, 0, 0, 0);
              if (minVal) minVal.setHours(0, 0, 0, 0);
              if (maxVal) maxVal.setHours(23, 59, 59, 999);
            }
          }

          if (minVal && dateVal < minVal) return { minDate: true };
          if (maxVal && dateVal > maxVal) return { maxDate: true };
          return null;
        };

        // Add validator to the control
        control.addValidators(rangeValidator);

        // Set initial min/max dates if reference controls have values
        if (referenceControl?.value) this.updateMinDate(referenceControl.value);
        if (maxReferenceControl?.value) this.updateMaxDate(maxReferenceControl.value);

        // Trigger initial validation
        control.updateValueAndValidity({ emitEvent: false });

        control.valueChanges.subscribe(() => {
          control.updateValueAndValidity({ emitEvent: false });
          referenceControl?.updateValueAndValidity({ emitEvent: false });
          maxReferenceControl?.updateValueAndValidity({ emitEvent: false });
        });

        referenceControl?.valueChanges.subscribe((value) => {
          this.updateMinDate(value);
          control.updateValueAndValidity({ emitEvent: false });
          referenceControl.updateValueAndValidity({ emitEvent: false });
        });

        maxReferenceControl?.valueChanges.subscribe((value) => {
          this.updateMaxDate(value);
          control.updateValueAndValidity({ emitEvent: false });
          maxReferenceControl.updateValueAndValidity({ emitEvent: false });
        });
      }
    }
  }

  private updateMinDate(value: any): void {
    if (value) {
      const mDate = this.parseInputDate(value);
      if (this.mode === 'date') {
        if (this.utcMode) {
          mDate.setUTCHours(0, 0, 0, 0);
        } else {
          mDate.setHours(0, 0, 0, 0);
        }
      }
      this.minDate = mDate;
    } else {
      this.minDate = undefined;
    }
  }

  private updateMaxDate(value: any): void {
    if (value) {
      const xDate = this.parseInputDate(value);
      if (this.mode === 'date') {
        if (this.utcMode) {
          xDate.setUTCHours(23, 59, 59, 999);
        } else {
          xDate.setHours(23, 59, 59, 999);
        }
      }
      this.maxDate = xDate;
    } else {
      this.maxDate = undefined;
    }
  }

  onDateSelect(event: any): void {
    if (event) {
      const selectedDate = event as Date;

      // For time-only mode, don't apply UTC conversion
      if (this.mode === 'time') {
        this.formGroup.get(this.controlName)?.setValue(selectedDate);
        this.currentValue = selectedDate;
        return;
      }

      if (this.utcMode && (this.mode === 'date' || this.mode === 'datetime')) {
        const utcDate = this.convertToUTCDate(selectedDate);
        if (this.mode === 'date') {
          const dateOnly = new Date(Date.UTC(
            utcDate.getFullYear(),
            utcDate.getMonth(),
            utcDate.getDate()
          ));
          this.formGroup.get(this.controlName)?.setValue(dateOnly);
          this.currentValue = dateOnly;
        } else {
          this.formGroup.get(this.controlName)?.setValue(utcDate);
          this.currentValue = utcDate;
        }
      } else {
        this.formGroup.get(this.controlName)?.setValue(selectedDate);
        this.currentValue = selectedDate;
      }
    }
  }
}
