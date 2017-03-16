import { Component, NgZone } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

import { Device } from '../device/device';
import { NewRecord } from '../new-record/new-record';
import { EditRecord } from '../edit-record/edit-record';

import { ScanSledService } from '../../providers/scanSledService';
import { ParseBadgeService } from '../../providers/parseBadgeService';
import { SettingsService } from '../../providers/settingsService';
import { SoundService } from '../../providers/soundService';
import { InfoService } from '../../providers/infoService';


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
    private soundService : SoundService,
    private infoService : InfoService,
    private toastCtrl : ToastController
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
        if (lead.hasOwnProperty('VisitCount')) {          
          this.navCtrl.push(EditRecord, lead);
        } else {
          this.navCtrl.push(NewRecord, lead);
        }
      }, (err) => {
        let toast = this.toastCtrl.create({
          message: err,
          duration: 3000,
          position: 'top'
        });
        toast.present();
        return false;
      });      
    });
  }

  // Push the Edit user/station page
  editUserPage() {
    this.navCtrl.push(Device);
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

  // Manual input of badgeId
  searchByBadgeId(event) {
    if (window.navigator.onLine && this.infoService.leadsource.HasTranslation) {
      this.parseBadgeService.manuallyEnterBadge(event.target.value).subscribe((data) => {
        if (data.hasOwnProperty('VisitCount')) {
          this.navCtrl.push(EditRecord, data);
        } else {
          this.navCtrl.push(NewRecord, data);
        }
      }, (err) => {
        let toast = this.toastCtrl.create({
          message: err,
          duration: 3000,
          position: 'top'
        });
        toast.present();
        return false;
      });      
    } else {
      let msg = "There seems to be issues searching for records at this time."
      if (!window.navigator.onLine) {
        msg = "Please check your internet connection and try again."
      }
      let toast = this.toastCtrl.create({
        message: msg,
        duration: 3000,
        position: 'top'
      });
      toast.present();
      return false;
    }    
  }
  
}