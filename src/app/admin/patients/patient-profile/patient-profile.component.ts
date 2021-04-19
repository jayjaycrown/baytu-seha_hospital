import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { PatientService } from '../allpatients/patient.service';
import { Patient } from '../allpatients/patient.model';

@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.sass']
})
export class PatientProfileComponent implements OnInit {

  id: any;
  patientDetails: any = [];
  constructor(private route: ActivatedRoute, public patientService: PatientService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    // alert(this.id);
    this.patientService.getAPatient(this.id).subscribe((resp) => {
      this.patientDetails = resp;
    });
  }

}
