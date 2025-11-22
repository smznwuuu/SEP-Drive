import {Component, inject, OnInit} from '@angular/core';
import { MatTableModule} from '@angular/material/table';
import {LeaderboardService} from '@app/service/leaderboard.service';
import {LeaderboardDataSource} from '@app/service/leaderbaord.dataSource';
import {MatSortModule, Sort} from '@angular/material/sort';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {NavbarComponent} from '@app/navbar/navbar.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {MatCard} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';


@Component({
  selector: 'app-leaderboard',
  imports: [
    MatTableModule,
    MatSortModule,
    ReactiveFormsModule,
    NavbarComponent,
    MatCard,
    MatIcon,
    RouterLink,

  ],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css'
})
export class LeaderboardComponent implements OnInit {
  displayedColumns: string[] = [
    'username',
    'full_name',
    'total_distance',
    'rating',
    'drive_time',
    'total_rides',
    'total_earned',
  ];

  leaderBoardService = inject(LeaderboardService);
  dataSource = new LeaderboardDataSource(this.leaderBoardService)
  private fb = inject(FormBuilder);
  private searchValue = '';
  private currentSort: Sort = {active: 'total_rides', direction:'desc'}

  searchForm = this.fb.nonNullable.group({
    searchValue: '',
  })

  ngOnInit(): void {
    this.dataSource.loadDrivers(this.currentSort, this.searchValue);
    this.searchForm.controls.searchValue.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe(searchValue => {
      this.searchValue = searchValue;
      this.dataSource.loadDrivers(this.currentSort, this.searchValue);
    })
  }

  sortDrivers(sort: Sort) {
    this.currentSort = sort;
    this.dataSource.loadDrivers(sort, this.searchValue);
  }

  resetSearch() {
    this.searchForm.controls.searchValue.setValue('');

  }
}
