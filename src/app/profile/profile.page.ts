import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  questions_length = 0;
  questions: {[id:number]: {images: []; options: []}}[];
  question: {[id:number]: {images: []; options: []}};
  isQuestionsAnswered = false;
  answers: {answer:string}[];
  displayDate: string;
  currentDate: Date;
  
  summaries = {}
  currentGoal

  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  constructor(
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
    this.presentAlert("<h6>Your Goal: ~Burn " + predictedGoal + " Calories everyday for the next 7 days</h6> <h6> Choose a strength training workout from the options you can find at Menu > workouts or start with: </h6> <br> <img style='height: 160px;' src='https://pyblog.xyz/wp-content/uploads/2021/09/strength-traning.png'/>")
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      header: 'Workout',
      // subHeader: 'Keep it going',
      message: message,
      buttons: ["Let's do this! 🚀"]
    });

    await alert.present();
  }

}
