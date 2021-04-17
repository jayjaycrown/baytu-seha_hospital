import { Role } from './role';

export class User {
  id: number;
  img: string;
  username: string;
  password: string;
  fullName: string;
  // lastName: string;
  role: Role;
  token: string;
}
