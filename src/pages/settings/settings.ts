import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Device } from '../device/device';
import { SettingsService } from '../../providers/settingsService';
import { InfoService } from '../../providers/infoService';
import { LeadsService } from '../../providers/leadsService';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class Settings {
  devicePage : Component;
  pendingUpload : number = 0;
  pendingTranslation : number = 0;
  
  constructor(public navCtrl: NavController,
    private settingsService: SettingsService,
    private infoService : InfoService,
    private leadsService : LeadsService
  ) {
    this.devicePage = Device;       
  }  

  //
  ionViewWillEnter() {
    let query = this.settingsService.showDeleted ? '' : '&deleted=no';
    this.leadsService.count('?uploaded=no' + query).subscribe((data) => {
      this.pendingUpload = data.Count;
    }, (err) => {
      alert(JSON.stringify(err));
    });

    this.leadsService.count('?translated=no' + query).subscribe((data) => {
      this.pendingTranslation = data.Count;
    }, (err) => {
      alert(JSON.stringify(err));
    });
  }

  refreshCounts() {
    
  }

  // Navigate to Root
  navigateToEventList() {
    window.location.href = "http://localhost/navigate/home";
  }

}
