import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFireFunctionsModule} from '@angular/fire/functions';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AngularFireModule,
    ProfilePageRoutingModule,
    AngularFireFunctionsModule
  ],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
