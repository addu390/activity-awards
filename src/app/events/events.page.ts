import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

  slideOpts = {
    initialSlide: 1,
    autoplay: true,
    speed: 400
  };

  constructor() { }

  ngOnInit() {
  }

}
