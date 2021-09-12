import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { ChatService } from '../services/chat.service'
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  messages: Observable<any[]>;
  newMessage = '';

  constructor(
    private chatService: ChatService, 
    private router: Router) { }

  ngOnInit() {
    this.messages = this.chatService.getMessages();
  }

  sendMessage() {
    this.chatService.addMessage(this.newMessage).then(() => {
      this.newMessage = '';
      this.content.scrollToBottom();
    });
  }

}
