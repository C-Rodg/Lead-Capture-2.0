import { Component } from '@angular/core';

import { List } from '../list/list';
import { Device } from '../device/device';
import { Settings } from '../settings/settings';
import { ScanCamera } from '../scan-camera/scan-camera';
import { ScanSled } from '../scan-sled/scan-sled';

import { InfoService } from '../../providers/infoService';
import { SettingsService } from '../../providers/settingsService';

// TESTING - REMOVE
import { NewRecord } from '../new-record/new-record';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class Dashboard {
  
  listPage: Component;
  scanPage : Component;
  devicePage : Component;
  settingsPage : Component;

  totalLeads : string = "271";


  // REMOVE THIS ITEM
  recordPage : Component;

  constructor(public navCtrl : NavController, 
    private settingsService: SettingsService,
    private infoService : InfoService
    ) {
    this.listPage = List;    
    this.devicePage = Device;
    this.settingsPage = Settings;

    // TODO: Remove Record page
    this.recordPage = NewRecord;

    // TODO: detect if scanner present and navigate based off of that
    let scanner = false,
      scanPage;
    if(scanner) {
      scanPage = ScanSled;
    } else {
      scanPage = ScanCamera;
    }
    this.scanPage = scanPage;
  }

  navigateToRecord() {
    this.navCtrl.push(NewRecord);
  }


}
