import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { AngularFireAuth } from "@angular/fire/auth";
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  isAuthenticated = false;

  constructor(
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private fireauth: AngularFireAuth,
    private statusBar: StatusBar,
    private auth: AuthenticationService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.fireauth.onAuthStateChanged(user => {
        if (user) {
          this.auth.currentUser = user
          this.isAuthenticated = true;
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

  logout() {
    this.auth.logout();
    this.isAuthenticated = false;
  }
}
