import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { DatePickerModule } from 'primeng/datepicker';  // Changed from CalendarModule
import { SelectButtonModule } from 'primeng/selectbutton';
import { Router } from '@angular/router';
import { RegisterRequest, UserCarClass, UserRole } from '@models/auth.model';
import { AuthService } from '@app/service/auth.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { TwoFactorAuthComponent } from '@components/two-factor-auth/two-factor-auth.component';

// @ts-ignore
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    RouterModule,
    DatePickerModule,
    SelectButtonModule,
    ToastModule,
    DialogModule,
    FileUploadModule,
    TwoFactorAuthComponent
  ],
  providers: [MessageService],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterPage{

  registerData: RegisterRequest = {
    email: '',
    password: '',
    username: '',
    firstName: '',
    lastName: '',
    birthDate: null,
    role: UserRole.CUSTOMER,
    carClass: null,
    profilePicture: null
  };

  // 添加文件上传相关属性
  uploading: boolean = false;
  uploadedFileName: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  /*
    setFullYear gebe eine Zahl zurück,Timestamp!
    z.B.lokale Zeit 2007-05-23 T10:15:30 - UTC-Zeit 1970-01-01 T00:00:00de „Millisekunden-Differenz“
   */
  yearRange: string = `${new Date().getFullYear() - 100}:${new Date().getFullYear()}`;
  maxDate: Date = new Date(new Date().setFullYear(new Date().getFullYear()));
  defaultDate: Date = new Date(new Date().setFullYear(new Date().getFullYear() - 18));

  roleOptions = [
    { label: 'Driver', value: UserRole.DRIVER },
    { label: 'Customer', value: UserRole.CUSTOMER }
  ];
  carClassOptions = [
    { label: 'SMALL', value: UserCarClass.SMALL },
    { label: 'MEDIUM', value: UserCarClass.MEDIUM },
    { label: 'DELUXE', value: UserCarClass.DELUXE },
  ]
  isTwoFactorAuthVisible: boolean = false;

  savedUsername: string = '';

  /*
  Observable: ein abonnierbarer Datenstrom, von RxJS bereitgestellter Datentyp,
   zur asynchronen Operationen verwendet wird
   */
  onSubmit() {
    if (this.validateForm()) {
      this.authService.register(this.registerData).subscribe({
        next: (response) => {
          console.log(response.body)
          const res = JSON.parse(response.body as string)
          console.log(res)
          this.messageService.add({
            severity: 'success',
            summary: 'success',
            detail: res?.message || ''
          })
          if (res?.requiresTwoFactor) {
            this.savedUsername = res.username;
            this.showTwoFactorAuth();
            // this.router.navigate(['/auth/two-factor']);
          }
        },
        /*
        error是一个HttpErrorResponse Object，error.error=httpResponse.body
               error.message是Angular自动生成的一段错误描述
               von Angular automatisch generierte Fehlermeldung
               SyntaxError z.B. Unexpected token U in JSON at position 0
       severity: 'success'绿色, 'info'蓝色, 'warn'黄色, 'error'红色
         */
        error: (error) => {
          console.error('Registration failed', error);
          this.messageService.add({
            severity: 'error',
            summary: 'error',
            detail: error.error || error.message || 'Authentication failed'
          });
        }
      });
    }
  }

  showTwoFactorAuth() {
    this.isTwoFactorAuthVisible = true;
  }

  handleTwoFactorConfirm(code: string) {
    this.verifyTwoFactorCode(this.savedUsername ,code);
  }

  handleTwoFactorClose() {
    this.isTwoFactorAuthVisible = false;
  }

  /*
  success: Verification successful. You can log in.
  error: No verification code found. Please request a new one.
  */
  verifyTwoFactorCode(username: string, code: string) {
    this.authService.verifyTwoFactorCode( username, code).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'success',
          detail: response.body || ''
        });
        this.router.navigate(['/auth/login']).then(r => {
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

  private validateForm(): boolean {
    if (!this.registerData.email || !this.registerData.password ||
      !this.registerData.username || !this.registerData.firstName ||
      !this.registerData.lastName || !this.registerData.birthDate || !this.registerData.role || (this.registerData.role === UserRole.DRIVER && !this.registerData.carClass)) {
      this.messageService.add({
        severity: 'error',
        summary: 'error',
        detail: 'Please fill in all required fields!'
      })
      return false;
    }
    return true;
  }

  // 处理文件选择事件
  onProfilePictureSelect(event: any) {
    this.uploading = true;
    const file = event.files[0];

    if (file) {
      this.authService.uploadProfilePicture(file).subscribe({
        next: (response) => {

          const res = JSON.parse(response.body as string);
          console.log(res)
          this.registerData.profilePicture = res.url;
          this.uploadedFileName = file.name;
          this.messageService.add({
            severity: 'success',
            summary: 'Upload successful',
            detail: 'Profile picture uploaded successfully'
          });
          this.uploading = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Upload failed',
          });
          this.uploading = false;
        }
      });
    }
  }
}









