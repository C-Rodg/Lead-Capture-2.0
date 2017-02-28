import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Device } from '../device/device';
import { SettingsService } from '../../providers/settingsService';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class Settings {
  devicePage : Component;

  backgroundUploadWait : Number;
  quickScanMode : boolean;
  showDeleted : boolean;  

  constructor(public navCtrl: NavController, private settingsService: SettingsService) {
    this.devicePage = Device;    
  }  

}
