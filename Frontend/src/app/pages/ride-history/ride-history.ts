import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RideHistoryService, RideHistory, RideHistoryResponse } from '../../service/ride-history.service';
import {NavbarComponent} from '@app/navbar/navbar.component';

@Component({
  selector: 'app-ride-history',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    RatingModule,
    NavbarComponent,
    RouterLink
  ],
  templateUrl: './ride-history.html',
  styleUrls: ['./ride-history.css']
})

export class RideHistoryComponent implements OnInit {
  rides: RideHistory[] = [];
  loading: boolean = true;         //控制表格的加载动画 Steuert die Ladeanimation der PrimeNG-Tabelle
  totalRecords: number = 0;

  //以下变量都是 Query Parameter 查询变量
  currentPage: number = 0;
  pageSize: number = 10;
  sortField: string = '';          //排序的字段 das Feld, nach dem sortiert wird
  sortOrder: string = '';          //排序的规则 'asc'表示升序(aufsteigend)， 'desc'表示降序(absteigend)
  searchText: string = '';

  constructor(
    private rideHistoryService: RideHistoryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData(){
    this.loading = true;            //显示加载动画
    this.route.params.subscribe(params => {
      const username = params['username'];
      this.rideHistoryService.getRideHistory(
        username,                     //唯一的路径参数 RoutenParameter
        this.currentPage,
        this.pageSize,
        this.sortField,
        this.sortOrder,
        this.searchText
      ).subscribe(
        (response: RideHistoryResponse) => {
          this.rides = response.entries;
          this.totalRecords  = response.totalCount;
          this.loading = false;
        },
        (error) => {
          console.error('Error fetching ride history:', error);
          this.loading = false;
        }
      );
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.first;         //当前页 第一条记录 的索引
    this.pageSize = event.rows;             //当前页 最大显示记录数 maximale Anzahl der Historien pro Seite
    this.loadData();
  }

  onSort(event: any) {
    this.sortField = event.field;
    this.sortOrder = event.order === 1 ? 'asc' : 'desc';
    this.loadData();
  }

  onSearch() {
    this.currentPage = 0;
    this.loadData();
  }

  onReset() {
    this.searchText = '';
    this.currentPage = 0;
    this.loadData();
  }

}
