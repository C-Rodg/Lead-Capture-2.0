import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Device } from '../device/device';
import { Record } from '../record/record';

import { ScanCameraService } from '../../providers/scanCameraService';
import { ParseBadgeService } from '../../providers/parseBadgeService';
import { SettingsService } from '../../providers/settingsService';


@Component({
  selector: 'page-scan-camera',
  templateUrl: 'scan-camera.html'
})
export class ScanCamera  {
  devicePage : Component;

  constructor(public navCtrl: NavController, 
    private zone: NgZone, 
    private scanCameraService : ScanCameraService,
    private parseBadgeService : ParseBadgeService, 
    private settingsService: SettingsService) {
      this.devicePage = Device;        
  } 

  ionViewWillEnter() {
    (<any>window).OnDataRead = this.onZoneDataRead.bind(this);
    this.scanCameraService.turnOn();    
  }

  ionViewWillLeave() {
    this.scanCameraService.turnOff();    
  }

  ionViewDidLeave() {
    (<any>window).OnDataRead = null;
  }

  onZoneDataRead(data) {
    let scannedData = data;
    this.zone.run(() => {
      let parsedObj = this.parseBadgeService.parse(scannedData);
      this.navCtrl.push(Record, parsedObj);
    });
  } 

  toggleLight() {
    this.scanCameraService.toggleTorch();    
  }

  toggleCamera() {
    this.scanCameraService.toggleCamera();    
  }

  editUserPage() {
    this.navCtrl.push(Device);
  }

  searchByBadgeId(event) {
    // TODO: SEARCH FOR PERSON BY BADGE ID
    alert("SEARCHING for" + event.target.value);
  }

}
