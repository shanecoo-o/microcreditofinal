export type Role = "ADMIN" | "MANAGER" | "SUPPORT" | "USER";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
}

export interface AuthUser extends User {
  permissions: string[];
}

export interface Transaction {
  id: string;
  userId: string;
  type: "DEPOSIT" | "WITHDRAW" | "TRANSFER" | "PAYMENT";
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
  createdAt: string;
  description?: string;
}

export interface Wallet {
  userId: string;
  balance: number;
  currency: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  level: "info" | "success" | "warning" | "error";
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  module: string;
  ip: string;
  createdAt: string;
}

export interface Permission {
  id: string;
  key: string;
  description: string;
}

export interface RoleDef {
  id: string;
  name: Role | string;
  description: string;
  permissions: string[];
}
