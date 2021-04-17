import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/core/service/auth.service";
// import { Role } from "src/app/core/models/role";
import { AlertService } from '@full-fledged/alerts';
@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"],
})
export class SigninComponent implements OnInit {
  authForm: FormGroup;
  submitted = false;
  error = "";
  hide = true;
  role: any;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) {}
  ngOnInit() {
    this.authForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  get f() {
    return this.authForm.controls;
  }
  // adminSet() {
  //   this.authForm.get("username").setValue("admin@hospital.org");
  //   this.authForm.get("password").setValue("admin@123");
  // }
  // doctorSet() {
  //   this.authForm.get("username").setValue("doctor@hospital.org");
  //   this.authForm.get("password").setValue("doctor@123");
  // }
  // patientSet() {
  //   this.authForm.get("username").setValue("patient@hospital.org");
  //   this.authForm.get("password").setValue("patient@123");
  // }
  onSubmit() {
    this.submitted = true;
    this.error = "";
    if (this.authForm.invalid) {
      this.error = "Username and Password not valid !";
      this.alertService.danger(this.error);
      return;
    } else {
      this.authService
        .login(this.f.username.value, this.f.password.value)
        .subscribe(
          (res: any) => {
            if (res) {
               this.role = this.authService.currentUserValue.role;
               if (this.role === 'admin') {
                this.router.navigate(["/admin/dashboard/main"]);
              } else if (this.role === 'doctor') {
                this.router.navigate(["/doctor/dashboard"]);
              } else if (this.role === 'patient') {
                this.router.navigate(["/patient/dashboard"]);
              } else {
                this.router.navigate(["/authentication/signin"]);
              }
            } else {
              this.alertService.danger("Invalid Login");
              this.error = "Invalid Login";
            }
          },
          (error) => {
            this.error = error;
            this.alertService.danger(error);
            this.submitted = false;
          }
        );
    }
  }
}
