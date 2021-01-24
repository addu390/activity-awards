import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Account } from '../models/account/account';
import { ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  account = {} as Account

  constructor(
    private ngFireAuth: AngularFireAuth,
    private router: Router,
    private toast: ToastController) { }

  ngOnInit() {
  }

  async register() {
    try {
      const result = await this.ngFireAuth.createUserWithEmailAndPassword(this.account.email, this.account.password)
      this.presentToast("Account Succesfully Created");
      console.log("Account created", result)
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
