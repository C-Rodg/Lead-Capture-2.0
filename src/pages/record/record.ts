import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-record',
  templateUrl: 'record.html'
})
export class Record {
  firstName;
  lastName;
  badgeId;
  company;

  constructor(public navCtrl: NavController, params: NavParams) {
    let person = params.data;
    this.firstName = person.firstName,
    this.lastName = person.lastName,
    this.badgeId = person.badgeId,
    this.company = person.company;
  }

}
