# Activity Awards - Morgan Stanley - Code to Give 

### How does the application work?

After installing the application on your mobile device, with access to Apple Health Kit (Exercise Time, Step Count, Energy Burned, and Stand Time), the user can accept a challenge. 

An example of a challenge: Burn 250 calories and record 30 minutes of exercise time for seven consecutive days in the next two weeks.

Furthermore, the challenge is presented to the user based on the prior data.
After completing a challenge, the user is awarded a physical badge, similar to the virtual badge received in the "Awards" section of the Health app.

The current version of the application is only for IOS users and ideal for Apple Watch users.

### Installation
- Firebase Integration: https://www.remotestack.io/connect-firebase-to-ionic-app/
- npm install --save @ionic-native/health-kit
- Give access for HealthKit in "Capabilities" (Blog Post: https://devdactic.com/ionic-healthkit-integration/)
- Don't forget the info.plist in XCode to add description for data access: https://enappd.com/blog/best-fitness-plugins-for-ionic-4-how-to-use-pedometer/15/
- Set-up firebase for Auth and add firebaseConfig to environment.ts
- ionic capacitor run ios --livereload 
