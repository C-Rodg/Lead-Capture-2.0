import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { Device } from '../device/device';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class Settings {
  devicePage : Component;

  autouploadTime : Number = 4;

  constructor(public navCtrl: NavController) {
    this.devicePage = Device;
  }

}
