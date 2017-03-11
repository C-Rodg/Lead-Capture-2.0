import { Component } from '@angular/core';

import { List } from '../list/list';
import { Device } from '../device/device';
import { Settings } from '../settings/settings';
import { ScanCamera } from '../scan-camera/scan-camera';
import { ScanSled } from '../scan-sled/scan-sled';

import { InfoService } from '../../providers/infoService';
import { SettingsService } from '../../providers/settingsService';
import { LeadsService } from '../../providers/leadsService';

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

  totalLeads : number = 0;


  // REMOVE THIS ITEM
  recordPage : Component;

  constructor(public navCtrl : NavController, 
    private settingsService: SettingsService,
    private infoService : InfoService,
    private leadsService : LeadsService
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

  // Get leads from database
  ionViewWillEnter() {
    this.leadsService.find('deleted=no').subscribe((data) => {
      if (data && data.length >= 0) {
        this.totalLeads = data.length;
      } else {
        this.totalLeads = 0;
      }
    });
  }

  navigateToRecord() {
    this.navCtrl.push(NewRecord);
  }


}
