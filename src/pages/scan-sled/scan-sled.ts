import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Device } from '../device/device';
import { Record } from '../record/record';

// TEMPORARY FOR TESTING
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-scan-sled',
  templateUrl: 'scan-sled.html'
})
export class ScanSled {

  constructor(public navCtrl: NavController, public http: Http) {
    (<any>window).OnDataRead = this.handleDataRead.bind(this);
  }

  ionViewDidEnter() {
    this.http.get(`http://localhost/linea/enableButtonScan`).map((res) => res.json()).subscribe((data) => console.log(data));
  }

  ionViewDidLeave() {
    // Should I set window.OnDataRead to null??

    this.http.get(`http://localhost/linea/disableButtonScan`).map((res) => res.json()).subscribe((data) => console.log(data));
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

  handleDataRead(d) {
    alert("Read badge from LINEA:\n" + JSON.stringify(d));
    this.navCtrl.push(Record);
  }



}