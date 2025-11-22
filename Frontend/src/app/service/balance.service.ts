import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";

//Dependency injection, 是一个装饰器
@Injectable({
  providedIn: 'root'
})
export class BalanceService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  private apiBalanceUrl = `http://localhost:8080/wallet/balance`;
  private apiTopUpUrl = `http://localhost:8080/wallet/top-up`;

  constructor(private http: HttpClient) {}

  getUserBalance(username: string): Observable<HttpResponse<string>> {
    return this.http.get(`${this.apiBalanceUrl}/${username}`, { headers: this.headers, observe:'response', responseType: 'text' as const });
  }

  addFunds(username: string, amount: number): Observable<HttpResponse<string>> {
    return this.http.post(`${this.apiTopUpUrl}`, { username, amount }, { headers: this.headers, observe: 'response', responseType: 'text' as const });
  }
}
