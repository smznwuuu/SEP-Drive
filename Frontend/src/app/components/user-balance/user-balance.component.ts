import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { BalanceService } from '@app/service/balance.service';

// @ts-ignore
@Component({
  selector: 'app-user-balance',
  templateUrl: './user-balance.component.html',
  styleUrls: ['./user-balance.component.css'],
  standalone: true,
  providers: [MessageService],
  imports: [
    CommonModule,
    DialogModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    InputNumberModule,
    ToastModule
  ]
})
export class UserBalanceComponent implements OnInit {   //OnInit是生命周期钩子 Lebenszyklus-Hook in Angular
  //@Input 与 @Output 都是属性装饰器 Eigenschafts-Dekorator
  @Input() username: string = '';
  @Input() role: string = '';
  @Output() onClose = new EventEmitter<void>(); //onClose是一个Ereignisname(事件名)Ereignis zu auslösen. 从子组件发送给父组件

  currentBalance: number = 0;
  visible: boolean = true;
  visibleTop: boolean = false;
  amountToAdd: number = 0;

  constructor(private balanceService: BalanceService, private messageService: MessageService) {}

  ngOnInit() {
    this.refresh();
  }

  addFunds() {
    if (this.amountToAdd > 0) {
      this.balanceService.addFunds(this.username, this.amountToAdd).subscribe({
        next: (response) => {
          this.amountToAdd = 0;
          this.closeTop();
          this.refresh();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: response.body as string  //前端收到的是一个reiner String 纯String文本，无法进行JSON.parse操作
          });
        },
        error: (error) => {
          console.error('Error adding funds:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error || error.message || 'Failed to add funds' //error.error来自后端HttpResponse body
          });                                                             //error.message是Angular自动生成的错误描述
        }
      });
    }
  }

  refresh(flag: boolean = false) {
    if (!this.username) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Username is required'
      });
      return;
    }

    this.balanceService.getUserBalance(this.username).subscribe({
      next: (response) => {
        const res = JSON.parse(response.body as string); //后端返回的Response body是一个JSON对象，JSON Object，可以进行parse操作
        this.currentBalance = res.balance;
        if (flag) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail:  'Balance refreshed successfully'
          });
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error || error.message || 'Failed to get balance'
        });
      }
    });
  }

  showTop() {
    this.visibleTop = true;
  }

  close() {
    this.visible = false;
    this.onClose.emit();
  }

  closeTop() {
    this.visibleTop = false;
  }
}
