// src/app/dynamic-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormService } from '../form.service';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnInit {
  form: FormGroup;
  formFields: any[] = [];

  constructor(
    private fb: FormBuilder,
    private formService: FormService
  ) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    this.formService?.getFormFields().subscribe(data => {
    this.formFields = data.fields;

      this.formFields.forEach(field => {
        const control = this.fb.control('');
        this.form.addControl(field.name, control);
      });

      this.subscribeToFormChanges();
    });
  }

  subscribeToFormChanges() {
    this.form.get('ageGroup')?.valueChanges.subscribe((value) => {
      this.onAgeGroupChange(value);
    });

    this.form.get('startDate')?.valueChanges.subscribe(() => {
      this.updateDuration();
    });

    this.form.get('endDate')?.valueChanges.subscribe(() => {
      this.updateDuration();
    });

    this.form.get('duration')?.valueChanges.subscribe(() => {
      this.updateEndDate();
    });
  }

  onAgeGroupChange(value: string) {
    switch (value) {
      case 'Infant':
        this.form.get('ageRange')?.patchValue('0-2 years');
        break;
      case 'Child':
        this.form.get('ageRange')?.patchValue('3-12 years');
        break;
      case 'Teenager':
        this.form.get('ageRange')?.patchValue('13-19 years');
        break;
      case 'Young Adult':
        this.form.get('ageRange')?.patchValue('20-39 years');
        break;
      case 'Adult':
        this.form.get('ageRange')?.patchValue('40-59 years');
        break;
      case 'Senior':
        this.form.get('ageRange')?.patchValue('60+ years');
        break;
      // Add cases for other age groups as needed
      default:
        break;
    }
  }

  updateDuration() {
    const startDate = this.form.get('startDate')?.value;
    const endDate = this.form.get('endDate')?.value;
    if (startDate && endDate) {
      const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
      this.form.get('duration')?.patchValue(duration);
    }
  }

  updateEndDate() {
    const startDate = this.form.get('startDate')?.value;
    const duration = this.form.get('duration')?.value;
    if (startDate && duration) {
      const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);
      this.form.get('endDate')?.patchValue(endDate);
    }
  }
}
