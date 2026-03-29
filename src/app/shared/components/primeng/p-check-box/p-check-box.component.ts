import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-prime-check-box',
    standalone: true,
    imports: [
        CommonModule,
        CheckboxModule,
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './p-check-box.component.html',
    styleUrl: './p-check-box.component.scss'
})
export class PrimeCheckBoxComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() controlName = '';
  @Input() value = '';
  @Input() groupName = '';
  @Input() label = '';
  @Input() binary!: boolean;
  @Input() disabled: boolean = false;

  constructor() {}

  ngOnInit(): void {
    console.log('checkbox: ', this.controlName);
  }
}
