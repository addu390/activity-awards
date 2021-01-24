import { Component, OnInit } from '@angular/core';
import { HealthKit, HealthKitOptions } from '@ionic-native/health-kit/ngx'
import { Platform } from '@ionic/angular';
import { Activity } from '../models/account/activity';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  summaries = {}

  constructor(
    private healthKit: HealthKit,
    private platform: Platform) {
   }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.healthKit.available().then(available => {
        if (available) {
          var options: HealthKitOptions = {
            readTypes: [
              'HKQuantityTypeIdentifierStepCount', 
              'HKQuantityTypeIdentifierAppleExerciseTime', 
              'HKQuantityTypeIdentifierActiveEnergyBurned',
              'HKQuantityTypeIdentifierAppleStandTime'
              ],
            writeTypes: []
          }
          this.healthKit.requestAuthorization(options).then(allow => {
            this.loadHealthData();
          });
        }
      })
    })
  }

  loadHealthData() {
    /* Energy in Calories */
    this.executeQuery('HKQuantityTypeIdentifierActiveEnergyBurned', 'kcal')

    /* Exercise Time in Minutes */
    this.executeQuery('HKQuantityTypeIdentifierAppleExerciseTime', 'min')

    /* Stand Time in Hours */
    this.executeQuery('HKQuantityTypeIdentifierAppleStandTime', 'min')
  }

  executeQuery(sampleType: string, unit: string) {
    var startDate = new Date("January 01, 2021 00:00:00")
    var endDate = new Date()
    
    var standOptions = {
      startDate: startDate,
      endDate: endDate,
      unit: unit,
      sampleType: sampleType,
      aggregation: 'day'
    }

    this.healthKit.querySampleTypeAggregated(standOptions).then(data => {
      console.log(sampleType + " [Success] ", data)
      this.summaries[sampleType] = data;
    }, error => {
      console.log(sampleType + " [Error] ", error)
      this.summaries[sampleType] = error;
    });
  }

}
