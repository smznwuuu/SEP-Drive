import { Injectable } from '@angular/core';
import { Client, Message as StompMessage } from '@stomp/stompjs';
import { ReplaySubject, Subject, Observable } from 'rxjs';
import { MessageDTO } from '../models/message.model';
import { UserRating } from '../models/UserRating';
import { PaymentMessage } from '../models/paymentMessage';
import { Waypoint } from '../models/waypoint';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import {VariableInformation} from '@app/models/variableInformation';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  private stompClient: Client;
  public connected = new ReplaySubject<void>();

  public indexSubject = new Subject<number>();
  public statusSubject = new Subject<string>();
  public simSpeedSubject = new Subject<number>();
  public waypointSubject = new Subject<Waypoint[]>();

  private chatMessagesSubject = new Subject<MessageDTO>();
  public chatMessages$ = this.chatMessagesSubject.asObservable();

  constructor(private userService: UserService, private http: HttpClient) {
    this.stompClient = new Client({
      webSocketFactory: () => new WebSocket('ws://localhost:8080/ws'),
      reconnectDelay: 5000
    });

    this.stompClient.onConnect = () => {
      const userId = this.userService.getUserIdByToken();



      this.stompClient.subscribe(`/topic/user-${userId}`, (msg: StompMessage) => {
        const parsed: MessageDTO = JSON.parse(msg.body);
        this.chatMessagesSubject.next(parsed);
      });

      this.connected.next();
    };

    this.stompClient.onStompError = () => {
      this.connected.error(new Error('STOMP connection failed'));
    };

    this.stompClient.onWebSocketClose = () => {};
    this.stompClient.onWebSocketError = () => {};

    this.stompClient.activate();
  }

  private subscribeToRideTopics(rid: number) {
    this.stompClient.subscribe(`/topic/position/${rid}`, msg => {
      this.indexSubject.next(parseInt(msg.body));
    });

    this.stompClient.subscribe(`/topic/status/${rid}`, msg => {
      this.statusSubject.next(msg.body);
    });

    this.stompClient.subscribe(`/topic/simSpeed/${rid}`, msg => {
      this.simSpeedSubject.next(parseInt(msg.body));
    });

    this.stompClient.subscribe(`/topic/waypoints/${rid}`, msg => {
      this.waypointSubject.next(JSON.parse(msg.body));
    });
  }

  sendChatMessage(message: MessageDTO): void {
    if (!this.stompClient.connected) return;
    this.stompClient.publish({
      destination: '/app/chat',
      body: JSON.stringify(message),
      headers: { 'content-type': 'application/json' }
    });
  }

  editMessage(messageId: number, newContent: string): Observable<MessageDTO> {
    return this.http.put<MessageDTO>(`http://localhost:8080/api/chat/edit/${messageId}`, {
      content: newContent
    });
  }

  deleteMessage(messageId: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/api/chat/delete/${messageId}`);
  }

  sendStatus(status : string){
    console.log("Status erhalten: " + status)
    this.stompClient.publish({
      destination: '/app/simulation/status',
      body: status
    })
  }

  sendRouteLength(length : number){
    this.stompClient.publish({
      destination: '/app/simulation/route',
      body: length.toString()
    })
    console.log("Routenlänge gesendet" + length);
  }

  sendSimSpeed(speed : number){
    this.stompClient.publish({
      destination: '/app/simulation/speed',
      body: speed.toString()
    })
    console.log("Speed gesendet")
  }

  sendRating(rating : UserRating){
    console.log()
    this.stompClient.publish({
      destination: '/app/simulation/rating',
      body: JSON.stringify(rating)
    })
  }

  sendRId(id : number){
    this.subscribeToRideTopics(id);
    this.stompClient.publish({
      destination: '/app/simulation/rid',
      body: id.toString()
    })
    console.log("Riderequest ID gesendet: " + id)
  }

  sendPaymentInformation(paymentMessage : PaymentMessage){
    this.stompClient.publish({
      destination: '/app/simulation/payment',
      body: JSON.stringify(paymentMessage)
    })
  }

  sendRealPrice(price : number){
    this.stompClient.publish({
      destination: '/app/simulation/price',
      body: price.toString()
    })
  }

  sendWaypoints(waypoints : Waypoint[]){
    for(let wp of waypoints){
      console.log(wp.isVirtual)
    }
    this.stompClient.publish({
      destination: '/app/simulation/waypoints',
      body: JSON.stringify(waypoints)
    })
  }

  sendProgress(progress : number){
    this.stompClient.publish({
      destination: '/app/simulation/progress',
      body: progress.toString()
    })
  }

  sendVariableInformation(information: VariableInformation){
    this.stompClient.publish({
      destination: '/app/simulation/endInformation',
      body: JSON.stringify(information)
    })
  }
}
