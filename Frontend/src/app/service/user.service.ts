import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { UserProfile} from '../models/user.model';
import { MessageDTO } from '../models/message.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = "http://localhost:8080/users" //backend pfad

  constructor(private http: HttpClient) { }

  //überprüft ob user existiert anhand username
  userExists(username: string): Observable<boolean> {
    return this.http.get<boolean>(this.apiUrl + `/exists/${username}`)
  }

  //holt userprofil mithilfe von username
  getUserProfile(username: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.apiUrl + `/${username}`);
  }

  getUserProfileByID(id : number): Observable<UserProfile>{
    return this.http.get<UserProfile>("http://localhost:8080/users/findById/" + id)
  }

  getUserIdByToken() : number {
    let token = window.localStorage.getItem("token")
    if(token !== null){
      return Number(token.split(" ")[0]);
    }
    else{
      return -1;
    }
  }

  //extrahiert den username aus token und gibt ihn zurück
  getUsernameByToken() : string {
    let token = window.localStorage.getItem("token")! //Non-null assertion operator weil garantiert nicht null
    return token.substring(token.lastIndexOf(" ") + 1); //username ist nach letztem leerzeichen
  }

  getFullNameById(id: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/fullname/${id}`);
  }

  getRoleByToken(): string {
    let token = window.localStorage.getItem("token")!
    const parts = token.split(" ");
    return parts.length >= 2 ? parts[1] : '';
  }
  // getRole(username: String): Observable<string> {
  //   return this.http.get<string>(this.apiUrl + "users/findRoleByUsername/" + username)
  // }

  markMessagesAsRead(senderId: number, receiverId: number): Observable<void> {
    return this.http.post<void>(`http://localhost:8080/api/chat/read/${senderId}/${receiverId}`, {});
  }
  getChatHistory(userId1: number, userId2: number): Observable<MessageDTO[]> {
    return this.http.get<MessageDTO[]>(`http://localhost:8080/api/chat/history/${userId1}/${userId2}`);
  }





}
