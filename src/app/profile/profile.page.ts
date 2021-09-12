import { Component, OnInit } from '@angular/core';
import { HealthKit, HealthKitOptions } from '@ionic-native/health-kit/ngx'
import { Platform } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { JourneyService } from '../services/journey.service'


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  themes: {id: string; image: string; name: string;}[];
  isProfileGenerated = false;
  
  summaries = {}
  currentGoal

  constructor(
    private journeyService: JourneyService,
    private healthKit: HealthKit,
    private alertController: AlertController,
    private platform: Platform) {
   }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.journeyService.getThemes().subscribe((data) => {
        this.themes = data.map(e => {
          return {id: e.payload.doc.data()["id"], name: e.payload.doc.data()["name"], image: e.payload.doc.data()["image"]}
        })
      })

      this.journeyService.getProfile().subscribe((data) => {
        if (data.payload.exists) {
          this.isProfileGenerated = true;
        }
    })
      
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

  selectTheme(event, id: string) {
    this.journeyService.createProfile(id);
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
    // First Day of the current year.
    var startDate = new Date(new Date().getFullYear(), 0, 1);
    
    // Current Date (Today).
    var endDate = new Date()
    
    var standOptions = {
      startDate: startDate,
      endDate: endDate,
      unit: unit,
      sampleType: sampleType,
      aggregation: 'day'
    }

    this.healthKit.querySampleTypeAggregated(standOptions).then(data => {
      // console.log(sampleType + " [Success] ", data)
      this.summaries[sampleType] = data.reverse();
    }, error => {
      // console.log(sampleType + " [Error] ", error)
      this.summaries[sampleType] = error.reverse();
    });
  }

  calculateGoal() {
    this.journeyService.createProfile("Spider Man");

    var predictedGoal = 200;

    var summary = this.summaries["HKQuantityTypeIdentifierActiveEnergyBurned"]
    var sum = 0;
    
    for(var i = 0; i < summary.length; i++) {
      sum += parseInt( summary[i].quantity, 10); // Add the base
    }
    
    var averageGoal = sum/summary.length;
    if (averageGoal > 200) {
      predictedGoal = averageGoal;
    }
    console.log("the goal is ", predictedGoal)
    this.presentAlert("Your Goal: Burn " + predictedGoal + " Calories everyday for the next 7 days")
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      header: 'New Goal Alert',
      subHeader: 'Keep it going',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

}
