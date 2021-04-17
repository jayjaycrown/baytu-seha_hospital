import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '@full-fledged/alerts';
import { AuthService } from '../../../core/service/auth.service';
import { Router } from '@angular/router';
import { PatientService } from '../allpatients/patient.service';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.sass'],
})
export class AddPatientComponent {
  patientForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    // private auth: AuthService,
    public patientService: PatientService,
    private router: Router
  ) {
    this.patientForm = this.fb.group({
      fullName: ['', [Validators.required]],
      // last: [''],
      gender: ['', [Validators.required]],
      contactNumber: [''],
      dob: ['', [Validators.required]],
      age: [''],
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      maritalStatus: [''],
      address: ['', [Validators.required]],
      bGroup: [''],
      bPresure: [''],
      // sugger: [''],
      // injury: [''],
      // uploadImg: [''],
      patientRegistrationNumber: ['', [Validators.required]],
      nationality: ['', [Validators.required]],
      city: ['', [Validators.required]],
      guardian: fb.group({
        guardianType: [''],
        fullName: [''],
        gender: [''],
        contactNumber: ['']
      })
    });
  }
  onSubmit() {
    console.log('Form Value', this.patientForm.value);
    this.patientService.registerPatient(this.patientForm.value).subscribe((res: any) => {
      console.log(res);
      this.alertService.success(res.message);
      this.router.navigateByUrl('/admin/patients/all-patients');
    }, err => {
        this.alertService.danger(err);
    });
  }
}
