import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthenticationService } from '../services/authentication.service'

@Injectable({
  providedIn: 'root'
})
export class JourneyService {
  themes: {id: string; image: string; name: string;}[];

  constructor(public firestore: AngularFirestore,
    private auth: AuthenticationService) { }

  createProfile(theme: string): Promise<void> {
    const id = this.auth.currentUser.uid;
    return this.firestore.doc(`profile/${id}`).set({
      id,
      theme,
    });
  }

  getThemes() {
    return this.firestore.collection("themes").snapshotChanges()
  }

  getProfile() {
    const id = this.auth.currentUser.uid;
    return this.firestore.collection("profile").doc(id).snapshotChanges();
  }

}
