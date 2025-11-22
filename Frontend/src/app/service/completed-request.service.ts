import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UpdatedRatingMessage} from '@app/models/updatedRatingMessage';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompletedRequestService {

  route = "http://localhost:8080/completedRequests/"

  constructor(private httpClient: HttpClient) {
  }

  addRatingFromCustomer(updatedRatingMessage : UpdatedRatingMessage) : Observable<any>{
    return this.httpClient.post<any>(this.route + "addRatingFromCustomer", updatedRatingMessage)
  }

  addRatingFromDriver(updatedRatingMessage : UpdatedRatingMessage) : Observable<any>{
    return this.httpClient.post<any>(this.route + "addRatingFromDriver", updatedRatingMessage)
  }
}
