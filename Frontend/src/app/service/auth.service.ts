import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable, catchError, map, throwError } from "rxjs";
import { LoginRequest, LoginCodeRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../core/models/auth.model";
import { Global } from "../global";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(
    private http: HttpClient,
  ) {}

  //register
  register(user: RegisterRequest): Observable<HttpResponse<string>> {
    return this.http.post(
      `${Global.authServiceUrl}/register`,
      user,
      { headers: this.headers, observe: 'response', responseType: 'text' as const }
    );
  }

  //login
  loginCode(loginCodeRequest: LoginCodeRequest): Observable<HttpResponse<string>> {
    return this.http.post(
      `${Global.authServiceUrl}/login/code`,
      loginCodeRequest,
      { headers: this.headers, observe: 'response', responseType: 'text' as const }
    )
  }
  login(loginRequest: LoginRequest): Observable<HttpResponse<string>> {
    return this.http.post(
      `${Global.authServiceUrl}/login`,
      loginRequest,
      { headers: this.headers, observe:'response', responseType: 'text' as const }
    )
  }

  //Zwei-Faktor-Code überprüfen(验证认证码)
  verifyTwoFactorCode(username: string, code: string): Observable<HttpResponse<string>> {
    return this.http.post(
      `${Global.authServiceUrl}/verify-code`,
      { username, code },
      { headers: this.headers, observe: 'response', responseType: 'text' as const }
    )
  }

  // 上传头像
  uploadProfilePicture(file: File): Observable<HttpResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(
      `${Global.authServiceUrl}/upload/profile-picture`,
      formData,
      { observe: 'response', responseType: 'text' as const }
    );
  }

}
