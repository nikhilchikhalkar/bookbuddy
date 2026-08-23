export interface IAdmin {
  _id?: string;
  email: string;
  passwordHash: string;
  name: string;
  role: "admin" | "superadmin";
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AdminSession {
  adminId: string;
  email: string;
  name: string;
  role: string;
}
