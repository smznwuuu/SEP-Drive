import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs';
import {PaymentMessage} from '@app/models/paymentMessage';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  routeUrl = "http://localhost:8080/wallet/ride/complete"

  constructor(private httpClient : HttpClient) { }

  public pay(completedrequest: PaymentMessage): Observable<string> {
    console.log("Zahlung wird durchgeführt: " + JSON.stringify(completedrequest))
    return this.httpClient.post(this.routeUrl, completedrequest, { responseType: 'text' });
  }
}
