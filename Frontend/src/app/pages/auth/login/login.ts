import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { Router } from '@angular/router';
import { LoginCodeRequest, LoginRequest } from '@models/auth.model';
import { AuthService } from '@app/service/auth.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { TwoFactorAuthComponent } from '@components/two-factor-auth/two-factor-auth.component';

//@ts-ignore
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    PasswordModule,
    RouterModule,
    ToastModule,
    DialogModule,
    TwoFactorAuthComponent
  ],
  providers: [MessageService],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class LoginPage {
  loginCodeData: LoginCodeRequest = {
    username: '',
    password: '',
  };

  isTwoFactorAuthVisible: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  onLogin() {
    this.authService.loginCode(this.loginCodeData).subscribe({
      next: (response) => {
        this.messageService.add({
          severity:'success',
          summary: 'success',
          detail: response.body || ''
        })
        // 显示双因素认证对话框
        this.showTwoFactorAuth();
        // this.router.navigate(['/auth/two-factor']);
      },
      error: (error) => {
        console.error('Login Failed', error);
        this.messageService.add({
          severity: 'error',
          summary: 'error',
          detail: error.error || error.message || 'Authentication failed'
        });
      }
    });
  }

  showTwoFactorAuth() {
    this.isTwoFactorAuthVisible = true;
  }

  handleTwoFactorConfirm(code: string) {
    this.verifyTwoFactorCode(code);
  }

  handleTwoFactorClose() {
    this.isTwoFactorAuthVisible = false;
  }

  verifyTwoFactorCode(code: string) {

    // 调用验证服务
    this.authService.login({username: this.loginCodeData.username, password: this.loginCodeData.password, verificationCode: code}).subscribe({
      next: (response) => {
        const res = JSON.parse(response.body as string)
        this.messageService.add({
          severity: 'success',
          summary: 'success',
          detail: res.message || ''
        });
        localStorage.setItem('token', res.token);
        this.router.navigate(['/dashboard']).then(r => {
          console.log(r)
        });

      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'error',
          detail: error.error || error.message || 'Authentication failed'
        });
      }
    });
  }
}
