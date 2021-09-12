import { Component, OnInit } from '@angular/core';
import { Account } from '../models/account/account';
import { AuthenticationService } from '../services/authentication.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  account = {} as Account

  constructor(
    private auth: AuthenticationService) { }

  ngOnInit() {
  }

  async register() {
    this.auth.register(this.account.email, this.account.password)
  }

}
