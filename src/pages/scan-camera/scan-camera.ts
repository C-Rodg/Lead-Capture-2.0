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
      this.soundService.playGranted();
      this.parseBadgeService.parse(scannedData).subscribe((data) => {
        alert(JSON.stringify(data));
        this.navCtrl.push(NewRecord);
      })

      // TODO:
      // If not found in DB, push NewRecord, else push EditRecord
      //this.navCtrl.push(NewRecord, parsedObj);
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
    alert("SEARCHING for" + event.target.value);

    // TODO:
    // Check if online
    // If online, then try to translate and if successful push new record

    this.navCtrl.push(NewRecord);
  }

}
