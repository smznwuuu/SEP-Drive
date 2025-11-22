import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {LeaderboardModel} from '@app/models/leaderboard.model';
import {Observable} from 'rxjs';
import {Sort} from '@angular/material/sort';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {

  constructor(private http: HttpClient) { }

  fetchLeaderboard(sort: Sort, searchValue: string): Observable<LeaderboardModel[]> {
    const params = new HttpParams()
      .set('sortBy', sort.active)
      .set('order', sort.direction)
      .set('filter', searchValue)
    return this.http.get<LeaderboardModel[]>('http://localhost:8080/users/sortby', {
      params
    });
  }

}
