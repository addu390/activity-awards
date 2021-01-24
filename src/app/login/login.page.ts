import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { ToastController } from '@ionic/angular';
import { Account } from '../models/account/account';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  account = {} as Account

  constructor(
    private ngFireAuth: AngularFireAuth,
    private toast: ToastController) { }

  ngOnInit() {
  }

  async login() {
    try {
      const result = await this.ngFireAuth.signInWithEmailAndPassword(this.account.email, this.account.password)
      this.presentToast("Login Succesful");
      console.log("Account signed in", result)
    }
    catch(e) {
      console.log(e)
      this.presentToast(e.message);
    }
  }

  async presentToast(errorMessage: string) {
    const toast = await this.toast.create({
      message: errorMessage,
      duration: 2000
    });
    toast.present();
  }


}
