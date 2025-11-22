import { Injectable} from '@angular/core';
import { DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';
import {LeaderboardService} from '@app/service/leaderboard.service';
import {Sort} from "@angular/material/sort";
import {LeaderboardModel} from '@app/models/leaderboard.model';

@Injectable()
export class LeaderboardDataSource extends DataSource<LeaderboardModel> {
  leaderboardSubject = new BehaviorSubject<LeaderboardModel[]>([]);

  constructor(private leaderboardService: LeaderboardService) {
    super();
  }

  connect(): Observable<LeaderboardModel[]> {
    return this.leaderboardSubject.asObservable();
  }

  disconnect(): void {
    this.leaderboardSubject.complete();
  }

  loadDrivers(sort: Sort, searchValue: string): void{
    this.leaderboardService.fetchLeaderboard(sort, searchValue).subscribe(leaderboard =>
      this.leaderboardSubject.next(leaderboard));
  }

}
