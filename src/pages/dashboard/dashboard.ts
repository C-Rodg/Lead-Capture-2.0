import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';

import { List } from '../list/list';
import { Device } from '../device/device';
import { Settings } from '../settings/settings';
import { ScanCamera } from '../scan-camera/scan-camera';
import { ScanSled } from '../scan-sled/scan-sled';

import { InfoService } from '../../providers/infoService';
import { SettingsService } from '../../providers/settingsService';
import { LeadsService } from '../../providers/leadsService';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class Dashboard {
  
  listPage: Component;
  devicePage : Component;
  settingsPage : Component;

  totalLeads : number = 0;

  constructor(public navCtrl : NavController, 
    private settingsService: SettingsService,
    private infoService : InfoService,
    private leadsService : LeadsService
    ) {
    this.listPage = List;    
    this.devicePage = Device;
    this.settingsPage = Settings;   
  }

  // Get leads from database
  ionViewWillEnter() {
    let query = this.settingsService.showDeleted ? '' : '?deleted=no';
    this.leadsService.count(query).subscribe((data) => {
      this.totalLeads = data.Count;
    });
  }

  // Get sled or camera scan page
  getScanPage() {    
    this.infoService.getClientInfo().subscribe((data) => {
      if (this.infoService.getLineaStatus()) {
        this.navCtrl.push(ScanSled);
      } else {
        this.navCtrl.push(ScanCamera);
      }      
    }, (err) => {
      this.navCtrl.push(ScanCamera);
    });   
  }
}
