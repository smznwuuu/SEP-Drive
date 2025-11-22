import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-two-factor-auth',
  templateUrl: './two-factor-auth.component.html',
  styleUrls: ['./two-factor-auth.component.css'],
  standalone: true,
  imports: [CommonModule, DialogModule, FormsModule, InputTextModule, ButtonModule]
})
export class TwoFactorAuthComponent {
  @Output() onConfirm = new EventEmitter<string>();
  @Output() onClose = new EventEmitter<void>();

  visible: boolean = true;
  code: string = '';

  confirm() {
    this.onConfirm.emit(this.code);
    // this.visible = false;
  }

  close() {
    this.visible = false;
    this.onClose.emit();
  }
}
