import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Device } from '../device/device';
import { SettingsService } from '../../providers/settingsService';
import { InfoService } from '../../providers/infoService';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class Settings {
  devicePage : Component;
  
  constructor(public navCtrl: NavController,
    private settingsService: SettingsService,
    private infoService : InfoService  
  ) {
    this.devicePage = Device;       
  }  

  navigateToEventList() {
    window.location.href = "http://localhost/navigate/home";
  }

}
