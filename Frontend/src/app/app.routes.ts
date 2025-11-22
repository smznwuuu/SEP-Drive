import {  Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { ProfileComponent} from './profile/profile.component';
import { DashboardComponent} from './dashboard/dashboard.component';
import { LoginPage } from '@pages/auth/login/login';
import { RegisterPage } from '@pages/auth/register/register';
import {ActiveRideRequestPageComponent} from '@app/active-ride-request-page/active-ride-request-page.component';
import {CreateRideRequestComponent} from '@app/create-ride-request/create-ride-request.component';
import {SimulationComponent} from '@app/simulation/simulation.component';
import { RideRequestTableComponent} from '@app/ride-request-table/ride-request-table.component';
import { RideOffersPageComponent } from '@app/ride-offers-page/ride-offers-page.component';
import { RideHistoryComponent } from './pages/ride-history/ride-history';
import { TripStatisticsComponent } from './pages/trip-statistics/trip-statistics';
import { LeaderboardComponent} from '@app/leaderboard/leaderboard.component';
import {ChatComponent} from '@app/chat/chat.component';


export const routes: Routes = [
  {
    path: 'auth/login',
    component: LoginPage,
    title: 'login',
  },
  {
    path: 'auth/register',
    component: RegisterPage,
    title: 'register',
  },
    { path: 'dashboard', component: DashboardComponent, title: 'Dashboard',    canActivate: [authGuard]
    },
    { path: 'profil/:username', component: ProfileComponent,    canActivate: [authGuard]
    },
    { path: 'active-ride-request', component: ActiveRideRequestPageComponent, canActivate: [authGuard]
    },
    { path: 'create-ride-request', component: CreateRideRequestComponent, canActivate: [authGuard]
    },
    {
    path: 'ride-history/:username',
    component: RideHistoryComponent,
   },
  {
    path: 'trip-statistics/:username',
    component: TripStatisticsComponent,
    canActivate: [authGuard],
    title: 'Grafische Statistiken'
  },
  { path: 'ride-simulation', component: SimulationComponent, canActivate: [authGuard]
  },
  {
    path: 'ride-offers', component: RideOffersPageComponent, // canActivate: [authGuard]
  },
  {
    path: 'chat/:partnerId', component: ChatComponent, canActivate: [authGuard]
  },
  {
    path: 'customer-requests', component: RideRequestTableComponent, canActivate: [authGuard]
  },
  {
    path: 'leaderboard', component: LeaderboardComponent, canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }

];
