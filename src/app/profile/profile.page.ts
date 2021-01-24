import { Component, OnInit } from '@angular/core';
import { HealthKit, HealthKitOptions } from '@ionic-native/health-kit/ngx'
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  stepCount = 'No Data'
  workouts = [];
  exerciseTime = 'No Data'

  constructor(private healthKit: HealthKit,
    private platform: Platform) {
    
      this.platform.ready().then(() => {
      this.healthKit.available().then(available => {
        if (available) {
          var options: HealthKitOptions = {
            readTypes: ['HKQuantityTypeIdentifierStepCount', 'HKQuantityTypeIdentifierAppleExerciseTime'],
            writeTypes: []
          }
          this.healthKit.requestAuthorization(options).then(allow => {
            this.loadHealthData();
          });
        }
      })
    })
   }

  ngOnInit() {
  }

  loadHealthData() {
    var stepOptions = {
      startDate: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      endDate: new Date(),
      unit: 'count',
      sampleType: 'HKQuantityTypeIdentifierStepCount' 
    }

    this.healthKit.querySampleType(stepOptions).then(data => {
      this.stepCount = data;
      console.log("The Step count is: ", data)
    }, error => {
      console.log('Error getting Step Count: ', error);
    });

    this.healthKit.findWorkouts().then(data => {
      this.workouts = data;
    }, err => {
      console.log('no workouts: ', err);
      this.workouts = err;
    });

    var exerciseOptions = {
      startDate: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      endDate: new Date(),
      sampleType: 'HKQuantityTypeIdentifierAppleExerciseTime' 
    }
    this.healthKit.querySampleType(exerciseOptions).then(data => {
      this.exerciseTime = data;
      console.log("Exercise time is: ", data)
    }, error => {
      console.log('Error getting Exercise time: ', error);
    });
  }

}
