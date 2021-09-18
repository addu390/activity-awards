import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

const URL = 'https://fitspirit.ca/girls/workouts?category=4#list' ;
@Component({
  selector: 'app-workout',
  templateUrl: './workout.page.html',
  styleUrls: ['./workout.page.scss'],
})
export class WorkoutPage implements OnInit {
  safeUrl: any;

  constructor(private domSanitizer: DomSanitizer) { }

  ngOnInit() {
    this.safeUrl = this.getSafeUrl() ;
  }

  getSafeUrl(){
    return this.domSanitizer.bypassSecurityTrustResourceUrl(URL) ;
  }

  ionViewWillEnter(){
    this.safeUrl = this.getSafeUrl() ;
  }

}
