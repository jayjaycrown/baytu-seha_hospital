import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { PatientService } from '../../patient.service';
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { Patient } from '../../patient.model';
import { Router } from '@angular/router';
import { AlertService } from '@full-fledged/alerts';

@Component({
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  patientForm: FormGroup;
  patient: Patient;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public patientService: PatientService,
    private fb: FormBuilder,
    private alertService: AlertService,
    private router: Router
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = data.patient.fullName;
      this.patient = data.patient;
    } else {
      this.dialogTitle = 'New Patient';
      this.patient = new Patient({});
    }
    this.patientForm = this.createContactForm();
  }
  formControl = new FormControl('', [
    Validators.required,
    // Validators.email,
  ]);
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
  }
  createContactForm(): FormGroup {
    return this.fb.group({

      // id: [this.patient.id],
      patientRegistrationNumber: [this.patient.patientRegistrationNumber],
      fullName: [this.patient.fullName],
      gender: [this.patient.gender],
      dob: [this.patient.dob],
      bGroup: [this.patient.bGroup],
      contactNumber: [this.patient.contactNumber],
      address: [this.patient.address],
      // treatment: [this.patient.treatment],





      // fullName: ['', [Validators.required]],
      // last: [''],
      // gender: ['', [Validators.required]],
      // contactNumber: [''],
      // dob: ['', [Validators.required]],
      // age: [''],
      // email: [
      //   '',
      //   [Validators.required, Validators.email, Validators.minLength(5)],
      // ],
      // maritalStatus: [''],
      // address: ['', [Validators.required]],
      // bGroup: [''],
      // bPresure: [''],
      // sugger: [''],
      // injury: [''],
      // uploadImg: [''],
      // patientRegistrationNumber: ['', [Validators.required]],
      // nationality: ['', [Validators.required]],
      // city: ['', [Validators.required]],
      // guardian: fb.group({
      //   guardianType: [''],
      //   fullName: [''],
      //   gender: [''],
      //   contactNumber: ['']
      // })
    // });
      // treatment: [this.patient.treatment],
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    this.patientService.registerPatient(this.patientForm.getRawValue()).subscribe((res: any) => {
      console.log(res);
      this.alertService.success(res.message);
      this.dialogRef.close();
      // this.router.navigateByUrl('/admin/patients/all-patients');
    }, err => {
        this.alertService.danger(err);
    });
  }
}
