import {Routes} from '@angular/router';
import {ContentComponent} from "./content/content.component";
import {DashboardComponent} from "./content/dashboard/dashboard.component";
import {configRouteResolver} from "./common/utils/config-route.resolver";
import {RegisterComponent} from "./pages/register/register.component";
import {LoginComponent} from "./pages/login/login.component";
import {ActivateComponent} from "./pages/activate/activate.component";
import {authGuard} from "./common/auth.guard";
import {CreateGameComponent} from "./pages/create-game/create-game.component";
import {LogoutComponent} from "./pages/logout/logout.component";
import {
  OrganizationSettingsComponent
} from "./content/organizations/organization-settings/organization-settings.component";
import {UserSettingsComponent} from "./content/users/user-settings/user-settings.component";
import {ManageUsersComponent} from "./content/organizations/manage-users/manage-users.component";
import {AddInviteComponent} from "./content/organizations/manage-users/add-invite/add-invite.component";
import {GeneralSettingsComponent} from "./content/settings/general-settings/general-settings.component";
import {PlayersListComponent} from "./content/players/players-list/players-list.component";
import {LeaderBoardsListComponent} from "./content/leaderboards/leader-boards-list/leader-boards-list.component";
import {
  AddUpdateLeaderboardComponent
} from "./content/leaderboards/add-update-leaderboard/add-update-leaderboard.component";
import {LeaderboardDetailsComponent} from "./content/leaderboards/leaderboard-details/leaderboard-details.component";
import {AchievementsListComponent} from "./content/achievements/achievements-list/achievements-list.component";
import {
  AddUpdateAchievementComponent
} from "./content/achievements/add-update-achievement/add-update-achievement.component";
import {AchievementDetailsComponent} from "./content/achievements/achievement-details/achievement-details.component";

const ONLY_ORGANIZATION_ADMIN: any = {
  role: 'ROLE_ORGANIZATION_ADMIN'
};

export const routes: Routes = [
  {
    path: 'sign-up',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent),
    resolve: { ready: configRouteResolver }
  },
  {
    path: 'sign-in',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    resolve: { ready: configRouteResolver }
  },
  {
    path: 'action/activate',
    loadComponent: () => import('./pages/activate/activate.component').then(m => m.ActivateComponent),
    resolve: { ready: configRouteResolver }
  },
  {
    path: 'action/logout',
    loadComponent: () => import('./pages/logout/logout.component').then(m => m.LogoutComponent),
    resolve: { ready: configRouteResolver }
  },
  {
    path: 'action/create-game',
    loadComponent: () => import('./pages/create-game/create-game.component').then(m => m.CreateGameComponent),
    resolve: { ready: configRouteResolver },
    canActivate: [authGuard],
  },
  {
    path: '',
    loadComponent: () => import('./content/content.component').then(m => m.ContentComponent),
    resolve: {
      ready: configRouteResolver
    },
    canActivate: [authGuard],
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: "full"},
      {path: 'dashboard', loadComponent: () => import('./content/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [authGuard],},
      {path: 'organization/settings', loadComponent: () => import('./content/organizations/organization-settings/organization-settings.component').then(m => m.OrganizationSettingsComponent), canActivate: [authGuard],},
      {path: 'users/settings', loadComponent: () => import('./content/users/user-settings/user-settings.component').then(m => m.UserSettingsComponent), canActivate: [authGuard],},
      {path: 'users', loadComponent: () => import('./content/organizations/manage-users/manage-users.component').then(m => m.ManageUsersComponent), canActivate: [authGuard], data: ONLY_ORGANIZATION_ADMIN},
      {path: 'users/invites/add', loadComponent: () => import('./content/organizations/manage-users/add-invite/add-invite.component').then(m => m.AddInviteComponent), canActivate: [authGuard], data: ONLY_ORGANIZATION_ADMIN},
      {path: 'players', loadComponent: () => import('./content/players/players-list/players-list.component').then(m => m.PlayersListComponent), canActivate: [authGuard]},
      {path: 'leaderboards', loadComponent: () => import('./content/leaderboards/leader-boards-list/leader-boards-list.component').then(m => m.LeaderBoardsListComponent), canActivate: [authGuard]},
      {path: 'leaderboards/add', loadComponent: () => import('./content/leaderboards/add-update-leaderboard/add-update-leaderboard.component').then(m => m.AddUpdateLeaderboardComponent), canActivate: [authGuard]},
      {path: 'leaderboards/:id/update', loadComponent: () => import('./content/leaderboards/add-update-leaderboard/add-update-leaderboard.component').then(m => m.AddUpdateLeaderboardComponent), canActivate: [authGuard]},
      {path: 'leaderboards/:id', loadComponent: () => import('./content/leaderboards/leaderboard-details/leaderboard-details.component').then(m => m.LeaderboardDetailsComponent), canActivate: [authGuard]},
      {path: 'achievements', loadComponent: () => import('./content/achievements/achievements-list/achievements-list.component').then(m => m.AchievementsListComponent), canActivate: [authGuard]},
      {path: 'achievements/add', loadComponent: () => import('./content/achievements/add-update-achievement/add-update-achievement.component').then(m => m.AddUpdateAchievementComponent), canActivate: [authGuard]},
      {path: 'achievements/:id/update', loadComponent: () => import('./content/achievements/add-update-achievement/add-update-achievement.component').then(m => m.AddUpdateAchievementComponent), canActivate: [authGuard]},
      {path: 'achievements/:id', loadComponent: () => import('./content/achievements/achievement-details/achievement-details.component').then(m => m.AchievementDetailsComponent), canActivate: [authGuard]},
      {path: 'settings/general', loadComponent: () => import('./content/settings/general-settings/general-settings.component').then(m => m.GeneralSettingsComponent), canActivate: [authGuard]},
    ]
  }
];


