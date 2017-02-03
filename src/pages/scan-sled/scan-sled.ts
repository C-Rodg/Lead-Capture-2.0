import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Device } from '../device/device';

@Component({
  selector: 'page-scan-sled',
  templateUrl: 'scan-sled.html'
})
export class ScanSled {

  constructor(public navCtrl: NavController) {
    
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
    } else {
      event.currentTarget.classList.remove('scan-clicked');
    }
  }

  startLineaScan() {
    
  }

}
