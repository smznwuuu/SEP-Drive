import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from '../global';

export interface RideHistory{
  requsetId: number;                                //Fahrt-ID
  time: string;                                     //Datum und Uhrzeit der Fahrt
  distance: number;                                 //Distanz z.B. 24km
  durationMinutes: number;                          //Dauer in Minuten 42min
  price: number;                                    //Bezahlung
  ratingFromCustomer: number;                       //Bewertung vom Kunden
  ratingFromDriver: number;                         //Bewertung vom Fahrer
  customerFullName: string;                         //Name des Kunden
  customerUsername: string;                         //Username des Kunden
  driverFullName: string;                           //Name des Fahrers
  driverUsername: string;                           //Username des Fahrers
  vehicleClass: string | null;                      //small, medium, deluxe
}

export interface RideHistoryResponse{
  entries: RideHistory[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class RideHistoryService {

  constructor(private http: HttpClient) {}

  /*
   获取行程历史列表
    @param username
    @param page 总页码（从0开始）
    @param size Anzahl der Elemente pro Seite
    @param sortBy 排序字段
    @param order 排序方式（asc, desc）
    @param search
   */
   getRideHistory(
    username: string,             //必填 路由参数 RoutenParameter
    page: number,                 //必填，没有设置默认值
    size: number,                 //必填，没有设置默认值
    sortBy: string = '',          //可选 optional, 有默认值 为空
    order: string = '',           //可选 optional  有默认值 为空
    search: string = ''           //可选 optional  有默认值 为空
  ): Observable<RideHistoryResponse>{
    console.log(username, page, size, sortBy, order, search);

    let params = new HttpParams() //HttpParams ist ein unveränderliches Objekt in Angula 不可变对象！
      .set('page', page.toString())       //key-value对 value的类型可以是string,number或者boolean ，这里直接写page也是对的！
      .set('size', size.toString());

    if(sortBy){
      params = params.set('sortBy', sortBy);
      params = params.set('order', order);
    }

    if(search){
      params = params.set('search', search);
    }

    return this.http.get<RideHistoryResponse>(`${Global.rideHistoryServiceUrl}/${username}`, { params });
  }
}
