import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Device } from '../device/device';
import { Record } from '../record/record';

import { SettingsService } from '../../providers/settingsService';

// TEMPORARY FOR TESTING
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-scan-sled',
  templateUrl: 'scan-sled.html'
})
export class ScanSled {

  constructor(public navCtrl: NavController, public http: Http, private zone: NgZone, private settingsService: SettingsService) {
    
  }

  ionViewDidEnter() {
    (<any>window).OnDataRead = this.onZoneDataRead.bind(this);
    this.http.get(`http://localhost/linea/enableButtonScan`).map((res) => res.json()).subscribe((data) => console.log(data));
  }

  ionViewWillLeave() {
    this.http.get(`http://localhost/linea/disableButtonScan`).map((res) => res.json()).subscribe((data) => console.log(data));
  }

  ionViewDidLeave() {
    (<any>window).OnDataRead = null;
  }

  onZoneDataRead(data) {
    let scannedData = data;
    this.zone.run(() => {
      alert(JSON.stringify(scannedData));
      this.navCtrl.push(Record);
    });
  }

  editUserPage() {
    this.navCtrl.push(Device);
  }

  searchByBadgeId(event) {
    alert("Searching for " + event.target.value);
  }

  scanBtnClicked(event, status) {
    if (status) {
      event.currentTarget.classList.add('scan-clicked');
      this.lineaScanCmd('startScan');
    } else {
      event.currentTarget.classList.remove('scan-clicked');
      this.lineaScanCmd('stopScan');
    }
  }

  lineaScanCmd(cmd) {
    this.http.get(`http://localhost/linea/${cmd}`).map((res) => res.json()).subscribe((data) => console.log(data));
  }

}