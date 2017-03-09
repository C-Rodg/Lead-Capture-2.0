import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Device } from '../device/device';
import { NewRecord } from '../new-record/new-record';
import { EditRecord } from '../edit-record/edit-record';

import { SettingsService } from '../../providers/settingsService';
import { ScanSledService } from '../../providers/scanSledService';

@Component({
  selector: 'page-scan-sled',
  templateUrl: 'scan-sled.html'
})
export class ScanSled {

  constructor(public navCtrl: NavController, 
    private zone: NgZone, 
    private settingsService: SettingsService,
    private scanSledService: ScanSledService ) {
    
  }

  ionViewDidEnter() {
    (<any>window).OnDataRead = this.onZoneDataRead.bind(this);
    this.scanSledService.sendScanCommand('enableButtonScan');   
  }

  ionViewWillLeave() {
    let scanBtn = document.getElementById('scan-btn-card');
    if (scanBtn) {
      scanBtn.classList.remove('scan-clicked');
    }
    this.scanSledService.sendScanCommand('disableButtonScan');      
  }

  ionViewDidLeave() {
    (<any>window).OnDataRead = null;
  }

  onZoneDataRead(data) {
    let scannedData = data;
    this.zone.run(() => {
      // TODO: SEND SCANNED DATA TO PARSING SERVICE
      alert(JSON.stringify(scannedData));
      this.navCtrl.push(NewRecord);
    });
  }

  editUserPage() {
    this.navCtrl.push(Device);
  }

  searchByBadgeId(event) {
    // TODO: SEARCH FOR ATTENDEE BY BADGE ID
    alert("Searching for " + event.target.value);
    this.navCtrl.push(NewRecord);
  }

  scanBtnClicked(event, status) {
    if (status) {
      event.currentTarget.classList.add('scan-clicked');
      this.scanSledService.sendScanCommand('startScan');
    } else {
      event.currentTarget.classList.remove('scan-clicked');
      this.scanSledService.sendScanCommand('stopScan');
    }
  }
  
}