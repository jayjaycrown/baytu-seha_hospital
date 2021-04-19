import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { PatientService } from "./patient.service";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Patient } from "./patient.model";
import { DataSource } from "@angular/cdk/collections";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormDialogComponent } from "./dialog/form-dialog/form-dialog.component";
import { DeleteComponent } from "./dialog/delete/delete.component";
import { BehaviorSubject, fromEvent, merge, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SelectionModel } from "@angular/cdk/collections";
import { Router } from '@angular/router';
import { AlertService } from '@full-fledged/alerts';

@Component({
  selector: "app-allpatients",
  templateUrl: "./allpatients.component.html",
  styleUrls: ["./allpatients.component.sass"],
})
export class AllpatientsComponent implements OnInit {
  displayedColumns = [
    "select",
    // "img",
    'patientRegistrationNumber',
    "fullName",
    "gender",
    "address",
    "contactNumber",
    "dob",
    // "bGroup",
    // "treatment",
    "actions",
  ];
  exampleDatabase: PatientService | null;
  dataSource: ExampleDataSource | null;
  selection = new SelectionModel<Patient>(true, []);
  index: number;
  id: number;
  patient: Patient | null;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public patientService: PatientService,
    private snackBar: MatSnackBar,
    private router: Router,
    public alertService: AlertService
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  ngOnInit() {
    this.loadData();
  }
  refresh() {
    this.loadData();
  }
  addNew() {
    // const dialogRef = this.dialog.open(FormDialogComponent, {
    //   data: {
    //     patient: this.patient,
    //     action: "add",
    //   },
    // });
    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result === 1) {
    //     // After dialog is closed we're doing frontend updates
    //     // For add we're just pushing a new row inside DataService
    //     this.exampleDatabase.dataChange.value.unshift(
    //       this.patientService.getDialogData()
    //     );
    //     this.refreshTable();
    //     this.showNotification(
    //       "snackbar-success",
    //       "Add Record Successfully...!!!",
    //       "bottom",
    //       "center"
    //     );
    //   }
    // });
    this.router.navigateByUrl('/admin/patients/add-patient');
  }
  editCall(id) {
    this.router.navigateByUrl('/admin/patients/edit-patient/' + id);
  }
  viewCall(id) {
    // alert(id);
    this.router.navigateByUrl('/admin/patients/profile/' + id);
  }
  deleteItem(i: number, row) {
    this.index = i;
    this.id = row.id;
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: row,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(
          (x) => x._id === this.id
        );
        // for delete we use splice in order to remove single object from DataService
        this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.renderedData.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.renderedData.forEach((row) =>
          this.selection.select(row)
        );
  }
  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.selection.selected.forEach((item) => {
      // const index: number = this.dataSource.renderedData.findIndex(
      //   (d) => d === item
      // );
      const id = item._id;
      this.patientService.deletePatient(id);
      // console.log(this.dataSource.renderedData.findIndex((d) => d === item));
      // this.exampleDatabase.dataChange.value.splice(index, 1);
      this.refreshTable();
      this.refresh();
      this.selection = new SelectionModel<Patient>(true, []);
    });
    this.showNotification(
      "snackbar-danger",
      totalSelect + " Record Delete Successfully...!!!",
      "bottom",
      "center"
    );
  }
  public loadData() {
    this.exampleDatabase = new PatientService(this.httpClient, this.alertService);
    this.dataSource = new ExampleDataSource(
      this.exampleDatabase,
      this.paginator,
      this.sort
    );
    fromEvent(this.filter.nativeElement, "keyup").subscribe(() => {
      if (!this.dataSource) {
        return;
      }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
}
export class ExampleDataSource extends DataSource<Patient> {
  filterChange = new BehaviorSubject("");
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: Patient[] = [];
  renderedData: Patient[] = [];
  constructor(
    public exampleDatabase: PatientService,
    public paginator: MatPaginator,
    // tslint:disable-next-line: variable-name
    public _sort: MatSort
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Patient[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.exampleDatabase.getAllPatients();
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((patient: Patient) => {
            const searchStr = (
              patient.patientRegistrationNumber +
              patient.fullName +
              patient.gender +
              patient.address +
              patient.dob +
              // patient.bGroup +
              // patient.treatment +
              patient.contactNumber
            ).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
          });
        // Sort filtered data
        const sortedData = this.sortData(this.filteredData.slice());
        // Grab the page's slice of the filtered sorted data.
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        this.renderedData = sortedData.splice(
          startIndex,
          this.paginator.pageSize
        );
        return this.renderedData;
      })
    );
  }
  disconnect() {}
  /** Returns a sorted copy of the database data. */
  sortData(data: Patient[]): Patient[] {
    if (!this._sort.active || this._sort.direction === "") {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = "";
      let propertyB: number | string = "";
      switch (this._sort.active) {
        case "id":
          [propertyA, propertyB] = [a._id, b._id];
          break;
        case "name":
          [propertyA, propertyB] = [a.fullName, b.fullName];
          break;
        case "gender":
          [propertyA, propertyB] = [a.gender, b.gender];
          break;
        case "date":
          [propertyA, propertyB] = [a.dob, b.dob];
          break;
        case "address":
          [propertyA, propertyB] = [a.address, b.address];
          break;
        case "mobile":
          [propertyA, propertyB] = [a.contactNumber, b.contactNumber];
          break;
      }
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      return (
        (valueA < valueB ? -1 : 1) * (this._sort.direction === "asc" ? 1 : -1)
      );
    });
  }
}
