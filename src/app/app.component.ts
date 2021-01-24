import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { AngularFireAuth } from "@angular/fire/auth";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private fireauth: AngularFireAuth,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.fireauth.onAuthStateChanged(user => {
        if (user) {
          this.router.navigate(['/profile']);
          this.splashScreen.hide();
        }
        else {
          this.router.navigate(['/home']);
          this.splashScreen.hide();
        }
      });
      this.statusBar.styleDefault();
    });
  }
}
