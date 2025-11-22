//User role and Car class enums
export enum UserRole {
  DRIVER = 'DRIVER',
  CUSTOMER = 'CUSTOMER'
}
export enum UserCarClass {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  DELUXE = 'DELUXE'
}

//Benutzerregistrierung Schnittstelle anforderung(用户注册请求接口)
export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  birthDate: Date | null;
  role: UserRole;
  carClass?: UserCarClass | null;
  profilePicture?: string | null;
}
export interface RegisterResponse {
  message: string;
  requiresTwoFactor?: boolean;
  username: string;
}


export interface LoginCodeRequest {
  username: string;
  password: string;
}
export interface LoginRequest extends LoginCodeRequest {
  verificationCode: string;
}

//Benutzeranmeldung Antwort Schnittstelle(用户登录响应接口)
export interface LoginResponse {
  token: string;
  message: string;
}

//User Informationen
export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  birthDate: Date | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

//Authentifizierung Status Schnittstelle(认证状态接口)
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}






