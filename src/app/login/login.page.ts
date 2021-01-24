import { Component, OnInit } from '@angular/core';
import { Account } from '../models/account/account';
import { AuthenticationService } from '../services/authentication.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  account = {} as Account

  constructor(
    private auth: AuthenticationService) { }

  ngOnInit() {
  }

  login() {
    this.auth.login(this.account.email, this.account.password)
  }
}
