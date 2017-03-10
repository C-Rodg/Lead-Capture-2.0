import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Device } from '../device/device';
import { NewRecord } from '../new-record/new-record';
import { EditRecord } from '../edit-record/edit-record';

import { ScanSledService } from '../../providers/scanSledService';
import { ParseBadgeService } from '../../providers/parseBadgeService';
import { SettingsService } from '../../providers/settingsService';
import { SoundService } from '../../providers/soundService';


@Component({
  selector: 'page-scan-sled',
  templateUrl: 'scan-sled.html'
})
export class ScanSled {
  testWord: string = "TESTT";
  constructor(public navCtrl: NavController, 
    private zone: NgZone, 
    private scanSledService: ScanSledService,
    private parseBadgeService : ParseBadgeService,
    private settingsService: SettingsService,    
    private soundService : SoundService
  ) {
    this.soundService.playSilent();
  }

  // Bind OnDataRead to this class, enable button scan
  ionViewWillEnter() {
    (<any>window).OnDataRead = this.onZoneDataRead.bind(this);
    this.scanSledService.sendScanCommand('enableButtonScan');   
  }

  // Disable button scan
  ionViewWillLeave() {
    let scanBtn = document.getElementById('scan-btn-card');
    if (scanBtn) {
      scanBtn.classList.remove('scan-clicked');
    }
    this.scanSledService.sendScanCommand('disableButtonScan');      
  }

  // Disallow scanning on other pages
  ionViewDidLeave() {
    (<any>window).OnDataRead = null;
  }

  // Zone function that parses badge data
  onZoneDataRead(data) {
    let scannedData = data;
    this.zone.run(() => {
      this.parseBadgeService.parse(scannedData).subscribe((lead) => {
        alert(JSON.stringify(lead));
        if (data.hasOwnProperty('VisitCount')) {
          this.navCtrl.push(EditRecord, lead);
        } else {
          this.navCtrl.push(NewRecord, lead);
        }
      });      
    });
  }

  // Push the Edit user/station page
  editUserPage() {
    this.navCtrl.push(Device);
  }

  // Manual input of badgeId
  searchByBadgeId(event) {
    alert("Searching for " + event.target.value);
    // TODO:
    // Check if online
    // If online, then try to translate and if successful push new record
    this.navCtrl.push(NewRecord);
  }

  // Add css class for scan button
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