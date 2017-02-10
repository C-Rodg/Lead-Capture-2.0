import { Component } from '@angular/core';

import { NavController, NavParams, ToastController } from 'ionic-angular';


@Component({
  selector: 'page-record',
  templateUrl: 'record.html'
})
export class Record {
  firstName;
  lastName;
  badgeId;
  company;
  notes : string = "";
  
  capturePage : string = "contact";

  constructor(public navCtrl: NavController, params: NavParams, public toastCtrl: ToastController) {
    // let person = params.data;
    // this.firstName = person.firstName,
    // this.lastName = person.lastName,
    // this.badgeId = person.badgeId,
    // this.company = person.company;
  }

  saveRecord() {
    // Check for required fields

    // All good, save record
    
    
    // Show confirmation and return to scan page
    let toast = this.toastCtrl.create({
      message: "Record was successfully saved!",
      duration: 2500,
      position: 'top'
    });
    toast.present();
    this.navCtrl.pop();
  }

}
