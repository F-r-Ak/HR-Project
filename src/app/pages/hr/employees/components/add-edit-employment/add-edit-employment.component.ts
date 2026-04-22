import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-add-edit-employment',
  imports: [],
  templateUrl: './add-edit-employment.component.html',
  styleUrl: './add-edit-employment.component.scss'
})
export class AddEditEmploymentComponent {
  @Output() employmentSubmitted = new EventEmitter<void>();
}
