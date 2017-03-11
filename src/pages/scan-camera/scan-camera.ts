import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Device } from '../device/device';
import { NewRecord } from '../new-record/new-record';
import { EditRecord } from '../edit-record/edit-record';

import { ScanCameraService } from '../../providers/scanCameraService';
import { ParseBadgeService } from '../../providers/parseBadgeService';
import { SettingsService } from '../../providers/settingsService';
import { SoundService } from '../../providers/soundService';


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
    private settingsService: SettingsService,
    private soundService: SoundService) {
      this.devicePage = Device;  
      this.soundService.playSilent();      
  } 

  // Set OnDataRead function and turn on camera
  ionViewWillEnter() {
    (<any>window).OnDataRead = this.onZoneDataRead.bind(this);
    this.scanCameraService.turnOn();    
  }

  // Shutoff camera on leaving
  ionViewWillLeave() {
    this.scanCameraService.turnOff();    
  }

  // Disallow scanning on other pages
  ionViewDidLeave() {
    (<any>window).OnDataRead = null;
  }

  // Zone function that parses badge and passes to Edit/New Record pages
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
      });
    });
  } 

  // Toggle light on/off
  toggleLight() {
    this.scanCameraService.toggleTorch();    
  }

  // Turn front/back camera
  toggleCamera() {
    this.scanCameraService.toggleCamera();    
  }

  // Edit Users/Stations
  editUserPage() {
    this.navCtrl.push(Device);
  }

  // Search by Badge ID, must have translation available
  searchByBadgeId(event) {    
    alert("SEARCHING for" + event.target.value);

    // TODO:
    // Check if online
    // If online, then try to translate and if successful push new record

    this.navCtrl.push(NewRecord);
  }

}
