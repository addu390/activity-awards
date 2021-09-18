import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HealthKit, HealthKitOptions } from '@ionic-native/health-kit/ngx'
import { Platform } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { JourneyService } from '../services/journey.service'
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  questions_length = 0;
  predictedGoal = 250;
  questions: {[id:number]: {images: []; options: []}}[];
  question: {[id:number]: {images: []; options: []}};
  isQuestionsAnswered = false;
  isEnrolledProgram = false;
  answers: {answer:string}[];
  goals: {goal:number, start:Date}[];
  displayDate: string;
  currentDate: Date;
  
  summaries = {}
  currentGoal

  slideOpts = {
    initialSlide: 1,
    autoplay: true,
    speed: 400
  };

  constructor(
    private router: Router,
    public loadingController: LoadingController,
    private changeDetection: ChangeDetectorRef,
    private journeyService: JourneyService,
    private healthKit: HealthKit,
    private alertController: AlertController,
    private platform: Platform) {
      this.currentDate = new Date();
      this.displayDate = (this.currentDate.getDate() - 7) + "-" + this.currentDate.getDate() + " ";
   }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.journeyService.getQuestions().subscribe((data) => {
        this.questions = data.map(e => {
          return {id: e.payload.doc.data()["id"], images: e.payload.doc.data()["images"], options: e.payload.doc.data()["options"]}
        })
        this.questions_length = this.questions.length
      })

      this.journeyService.getAnswers().subscribe((data) => {
        this.answers = data.map(e => {
          return {answer: e.payload.doc.data()["answer"]}
        })
        if (this.answers.length == this.questions_length) {
          this.isQuestionsAnswered = true;
        }
      })

      this.journeyService.getProgram().subscribe((data) => {
        this.goals = data.map(e => {
          return {goal: e.payload.doc.data()["goal"], start: e.payload.doc.data()["startDate"]}
        })
        if (this.goals.length > 0) {
          this.isEnrolledProgram = true;
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

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 700
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  answerQuestion(event, question_id: string, answer: number) {
    this.journeyService.answerQuestion(question_id, answer);
    this.questions.shift();
    this.changeDetection.detectChanges();
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
    if (this.isEnrolledProgram) {
      this.router.navigate(['/workout']);
      return;
    }
    this.presentLoading().then(() => {
      this.predictedGoal = 250;

      var summary = this.summaries["HKQuantityTypeIdentifierActiveEnergyBurned"]
      var sum = 0;
      
      for(var i = 0; i < 8; i++) {
        sum += parseInt( summary[i].quantity, 10); // Add the base
      }
      console.log(sum)
      
      var averageGoal = sum/7;
      if (averageGoal > 250) {
        this.predictedGoal = averageGoal;
      }
      this.presentAlert("<h6>Your Goal: Burn ~" + Math.round(this.predictedGoal / 50) * 50 + " Calories everyday for the next 7 days</h6> <h6> Choose a strength training workout from the options you can find at Menu > Workouts </h6> ")
    });
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      cssClass: 'alert-class',
      // header: 'Workout',
      message: message,
      buttons: [
        {
          text: 'Later',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: "Let's do this 🚀",
          handler: (alertData) => { //takes the data 
            this.journeyService.startProgram(this.predictedGoal);
            this.router.navigate(['/workout']);
        }
        }
      ]
    });

    await alert.present();
  }

  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

}
