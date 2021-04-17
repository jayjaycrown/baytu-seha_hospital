export class Patient {
  // tslint:disable-next-line: variable-name
  _id: number;
  img: string;
  name: string;
  gender: string;
  bGroup: string;
  dob: string;
  address: string;
  contactNumber: string;
  nationality: string;
  city: string;
  maritalStatus: string;
  patientRegistrationNumber: string;
  fullName: string;
  // treatment: string;
  constructor(patient) {
    {
      this._id = patient._id ;
      this.img = patient.avatar || 'assets/images/user/user1.jpg';
      this.fullName = patient.fullName || '';
      this.gender = patient.gender || 'male';
      // this.bGroup = patient.email || '';
      this.dob = patient.dob || '';
      this.address = patient.address || '';
      this.contactNumber = patient.contactNumber || '';
      this.nationality = patient.nationality || '';
      this.city = patient.city || '';
      this.maritalStatus = patient.maritalStatus || '';
      this.patientRegistrationNumber = patient.patientRegistrationNumber || '';
      // this.treatment = patient.treatment || '';
    }
  }
  // public getRandomID(): string {
  //   var S4 = function() {
  //     return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  //   };
  //   return S4() + S4();
  // }
}
