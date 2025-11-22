import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {UserService} from '../service/user.service';
import {catchError, EMPTY, map, switchMap} from 'rxjs';
import {AsyncPipe, NgIf} from '@angular/common';
import {NavbarComponent} from '@app/navbar/navbar.component';
import { ButtonModule } from 'primeng/button';
import {UserBalanceComponent} from '../components/user-balance/user-balance.component';


@Component({
  selector: 'app-profile',
  imports: [AsyncPipe, NgIf, NavbarComponent, RouterLink, ButtonModule, UserBalanceComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  errorMessage = '';
  router = inject(Router)
  showBalanceDialog=false;

  userProfile$ = this.route.paramMap.pipe(
    map(params => params.get('username')!), //holt username parameter aus route
    switchMap(username => this.userService.getUserProfile(username)),
    catchError(err => {
      this.errorMessage = 'Benutzerprofil konnte nicht geladen werden.';
      return EMPTY;
    })
  );

  //überprüft anhand url, ob auf eigenem profil ist
  isOwnProfile(): boolean{
    return this.router.url === '/profil/' + this.userService.getUsernameByToken()
  }
  //von zheyuan
  openBalanceDialog() {
    this.showBalanceDialog = true;
  }

  handleCloseDialog() {
    this.showBalanceDialog = false;
  }

  // bis hier
}
