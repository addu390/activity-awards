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

  answerQuestion(question_id: string, answer: number): Promise<void> {
    const id = this.auth.currentUser.uid;
    return this.firestore.doc(`users/${id}/questions/${question_id}`).set({
      answer: answer
    });
  }

  startProgram(goal: number): Promise<void> {
    const id = this.auth.currentUser.uid;
    let uuid = 1;
    return this.firestore.doc(`users/${id}/goals/${uuid}`).set({
      goal: goal,
      startDate: new Date()
    });
  }

  getProgram() {
    const id = this.auth.currentUser.uid;
    return this.firestore.collection(`users/${id}/goals`).snapshotChanges()
  }

  getQuestions() {
    return this.firestore.collection("questions").snapshotChanges()
  }

  getAnswers() {
    const id = this.auth.currentUser.uid;
    return this.firestore.collection(`users/${id}/questions`).snapshotChanges()
  }

  getProfile() {
    const id = this.auth.currentUser.uid;
    return this.firestore.collection("profile").doc(id).snapshotChanges();
  }

}
