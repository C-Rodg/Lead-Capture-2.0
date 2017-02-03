import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Device } from '../device/device';

// TEMPORARY FOR TESTING
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-scan-camera',
  templateUrl: 'scan-camera.html'
})
export class ScanCamera {
  devicePage : Component;

  // TESTING - THIS SHOULD COME FROM SERVICE
  camera = {
      visible : "YES",
      camera : "BACK",
      top: 62,
      left: 0,
      width: 320,
      height: 404
    };
  torch = "OFF";

  constructor(public navCtrl: NavController, public http : Http) {
    this.devicePage = Device;

   
    this.http.post('http://localhost/barcodecontrol', this.camera).map(res => res.json()).subscribe(data => console.log(data));
  }

  ionViewWillLeave() {
    this.http.post('http://localhost/barcodecontrol', { visible: "NO" }).map(res => res.json()).subscribe(data => console.log(data));
  }

  toggleLight() {
    this.torch = (this.torch === "OFF") ? "ON" : "OFF";
    this.http.post('http://localhost/barcodecontrol', {torch : this.torch}).map(res => res.json()).subscribe(data => console.log(data));
  }

  toggleCamera() {
    this.camera.camera = (this.camera.camera === "FRONT") ? "BACK" : "FRONT";
    this.http.post('http://localhost/barcodecontrol', this.camera).map(res => res.json()).subscribe(data => console.log(data));
  }

  editUserPage() {
    this.navCtrl.push(Device);
  }

  searchByBadgeId(event) {
    alert("SEARCHING for" + event.target.value);
  }

}
