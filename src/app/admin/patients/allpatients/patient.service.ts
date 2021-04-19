import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Patient } from "./patient.model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { AlertService } from '@full-fledged/alerts';

@Injectable()
export class PatientService {
  // private readonly API_URL = "assets/data/patient.json";
  isTblLoading = true;
  dataChange: BehaviorSubject<Patient[]> = new BehaviorSubject<Patient[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;
  constructor(
    private httpClient: HttpClient,
    private alertService: AlertService
  ) { }
  get data(): Patient[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
/** CRUD METHODS */

  getAllPatients(): void {
    this.httpClient.get<Patient[]>(`${environment.apiUrl}/patients`).subscribe(
      (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + " " + error.message);
      }
    );
  }

  registerPatient(data) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/patient/register`, data)
      .pipe();
  }
  getAPatient(id: any) {
    return this.httpClient.get<Patient[]>(`${environment.apiUrl}/patient/${id}`).pipe();
  }
  // addPatient(patient: Patient): void {
  //   this.dialogData = patient;

  //   /*  this.httpClient.post(this.API_URL, patient).subscribe(data => {
  //     this.dialogData = patient;
  //     },
  //     (err: HttpErrorResponse) => {
  //    // error code here
  //   });*/
  // }
  updatePatient(patient: Patient): void {
    this.dialogData = patient;

    /* this.httpClient.put(this.API_URL + patient.id, patient).subscribe(data => {
      this.dialogData = patient;
    },
    (err: HttpErrorResponse) => {
      // error code here
    }
  );*/
  }
  deletePatient(id: any): void {
    // console.log(id);

    this.httpClient.delete(`${environment.apiUrl}/patient/${id}`).subscribe((data: any) => {
      // console.log(id);
      this.alertService.success(data.message);
      },
      (err: HttpErrorResponse) => {
         // error code here
        this.alertService.danger(err.message);
      }
    );
  }
}
