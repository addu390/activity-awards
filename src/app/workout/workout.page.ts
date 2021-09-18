import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.page.html',
  styleUrls: ['./workout.page.scss'],
})
export class WorkoutPage implements OnInit {
  workouts: ['strength_training']

  constructor() { 
  this.workouts = ['strength_training'];
  }

  ngOnInit() {
  }



}
