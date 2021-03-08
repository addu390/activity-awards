import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { User } from '../models/account/user';
import { AuthenticationService } from './authentication.service';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private auth: AuthenticationService,
    private fireStore: AngularFirestore) { }

  addMessage(message) {
    return this.fireStore.collection('messages').add({
      message: message,
      from: this.auth.currentUser.uid,
      createdAt: new Date().getTime()
    });
  }

  getMessages() {
    let users = [];
    return this.getUsers().pipe(
      switchMap(res => {
        users = res;
        return this.fireStore.collection('messages', ref => ref.orderBy('createdAt')).valueChanges({ idField: 'id' }) as Observable<Message[]>;
      }),
      map(messages => {
        for (let m of messages) {          
          m.fromName = this.getUserfromMessage(m.from, users);
          m.isCurrent = this.auth.currentUser.uid === m.from;
        }        
        return messages
      })
    )
  }

  private getUserfromMessage(messageFromId, users: User[]): string {    
    for (let usr of users) {
      if (usr.uid == messageFromId) {
        return usr.email;
      }
    }
    return 'Deleted';
  }

  private getUsers() {
    return this.fireStore.collection('users').valueChanges({ idField: 'uid' }) as Observable<User[]>;
  }


}
