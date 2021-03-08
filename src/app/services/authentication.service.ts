import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { User } from '../models/account/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  currentUser: User = null;

  constructor(
    private fireauth: AngularFireAuth,
    private toast: ToastController,
    private router: Router
  ) { }

  getAuthenticatedUser() {
    return this.fireauth.authState;
  }

  login(email: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email, password)
      .then(res => {
        if (res.user) {
          console.log(res.user);
          this.currentUser = res.user;
          this.router.navigate(['profile'])
        }
      })
      .catch(err => {
        console.log(`login failed ${err}`);
      });
    }

  register(email: string, password: string) {
    this.fireauth
    .createUserWithEmailAndPassword(email, password)
      .then(res => {
        if (res.user) {
          this.currentUser = res.user;
          console.log(res.user);
          this.router.navigate(['login'])
        }
      })
      .catch(err => {
        console.log(`login failed ${err}`);
      });
  }

  recover(email) {
    this.fireauth.sendPasswordResetEmail(email)
      .then(data => {
        console.log(data);
        this.presentToast('Password reset email sent');
      })
      .catch(err => {
        console.log(`failed ${err}`);
      });
  }

  async presentToast(errorMessage: string) {
    const toast = await this.toast.create({
      message: errorMessage,
      duration: 2000
    });
    toast.present();
  }
}