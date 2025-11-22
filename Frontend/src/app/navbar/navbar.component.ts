import { Component } from '@angular/core';
import {UserService} from '@app/service/user.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  username: String;
  role: String;


  constructor(private userService: UserService) {
    this.username = this.userService.getUsernameByToken();
    this.role = this.userService.getRoleByToken();
  }

  isDriver(): boolean{
    return this.role === "DRIVER"
  }
}
