import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebsocketService } from '../service/websocket.service';
import { UserService } from '../service/user.service';
import { MessageDTO } from '../models/message.model';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {NavbarComponent} from '@app/navbar/navbar.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  ownId = 0;
  partnerId = 0;
  messages: MessageDTO[] = [];
  newMessageContent = '';
  connected = false;

  editingMessageId: number | null = null;
  editingMessageContent: string = '';

  private route = inject(ActivatedRoute);
  private websocketService = inject(WebsocketService);
  private userService = inject(UserService);

  ngOnInit(): void {

    this.loadChat();

    this.websocketService.connected.subscribe(() => {
      this.connected = true;

      this.websocketService.chatMessages$
        .pipe(takeUntil(this.destroy$))
        .subscribe(msg => {
          const relevant = (msg.senderId === this.ownId && msg.receiverId === this.partnerId) ||
            (msg.senderId === this.partnerId && msg.receiverId === this.ownId);

          if (relevant) {
            const index = this.messages.findIndex(m => m.id === msg.id);
            if (index !== -1) {
              this.messages[index] = { ...this.messages[index], ...msg };
            } else {
              this.messages.push(msg);
              if (msg.senderId === this.partnerId && msg.receiverId === this.ownId) {
                this.userService.markMessagesAsRead(this.partnerId, this.ownId).subscribe();
              }
            }
          }
        });
    });
  }

  sendMessage(): void {
    const msg: MessageDTO = {
      senderId: this.ownId,
      receiverId: this.partnerId,
      content: this.newMessageContent.trim(),
      timestamp: new Date().toISOString(),
      read: false,
      edited: false,
      deleted: false
    };
    this.websocketService.sendChatMessage(msg);
    this.newMessageContent = '';
  }

  canEditOrDelete(message: MessageDTO): boolean {
    return message.senderId === this.ownId && !message.read && !message.deleted;
  }

  startEditMessage(message: MessageDTO): void {
    if (this.canEditOrDelete(message)) {
      this.editingMessageId = message.id!;
      this.editingMessageContent = message.content;
    }
  }

  saveEditedMessage(): void {
    if (this.editingMessageId && this.editingMessageContent.trim()) {
      this.websocketService.editMessage(this.editingMessageId, this.editingMessageContent.trim())
        .subscribe(() => {
          this.editingMessageId = null;
          this.editingMessageContent = '';
        });
    }
  }

  cancelEditMessage(): void {
    this.editingMessageId = null;
    this.editingMessageContent = '';
  }

  deleteMessage(message: MessageDTO): void {
    if (message.id && this.canEditOrDelete(message) && confirm('Nachricht löschen?')) {
      this.websocketService.deleteMessage(message.id).subscribe();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isOwn(msg: MessageDTO): boolean {
    return msg.senderId === this.ownId;
  }

  loadChat(): void {
    this.ownId = this.userService.getUserIdByToken();
    this.partnerId = +this.route.snapshot.params['partnerId']; //ohne + geht nicht mehr weil string

    this.userService.getChatHistory(this.ownId, this.partnerId).subscribe(messages => {
      this.messages = messages;
    });

    this.userService.markMessagesAsRead(this.partnerId, this.ownId).subscribe();
  }
}
