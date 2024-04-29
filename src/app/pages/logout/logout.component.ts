import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {GameService} from "../../common/services/game.service";
import {AuthService} from "../../common/services/auth.service";

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.authService.logout();
    this.router.navigateByUrl('/sign-in').then();
  }

}
