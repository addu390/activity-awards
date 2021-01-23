import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HealthKit, HealthKitOptions } from '@ionic-native/health-kit/ngx'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  stepCount = 'No Data'

  constructor(
    private platform: Platform,
    private healthKit: HealthKit) {

      this.platform.ready().then(() => {
        this.healthKit.available().then(available => {
          if (available) {
            var options: HealthKitOptions = {
              readTypes: ['HKQuantityTypeIdentifierStepCount'],
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
  }

}
