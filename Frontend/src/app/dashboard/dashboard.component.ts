import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { UserService} from '../service/user.service';
import {FormsModule} from '@angular/forms';
import {NavbarComponent} from '@app/navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    FormsModule,
    NavbarComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  errorMessage: string = ''
  username: string
  role: string

  constructor(private router: Router, private userService: UserService) {
    this.username = this.userService.getUsernameByToken();
    this.role = this.userService.getRoleByToken()
  }

  searchUser(input: string) {
    if (!input || !input.trim()) { //input leer oder nur leerzeichen
      this.errorMessage = 'Bitte einen Benutzernamen eingeben!'
      return
    }
    const username = input.trim(); //entfernt leerzeichen von anfang & ende

    this.userService.userExists(username).subscribe({
      //wenn observable ein neuen wert ausgibt
      next: exists => {
        if (exists) {
          this.router.navigate(['/profil', username]);
        } else {
          this.errorMessage = `Benutzer "${username}" wurde nicht gefunden.`;
        }
      },
      //wenn ein fehler auftritt
      error: error => {
        this.errorMessage = 'Fehler bei der Benutzersuche.';
        console.error(error);
      }
    });
  }

  isDriver(): boolean{
    return this.role === "DRIVER"
  }

}
