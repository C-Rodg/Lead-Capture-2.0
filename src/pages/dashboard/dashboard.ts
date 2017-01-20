import { Component } from '@angular/core';

import { List } from '../list/list';
import { Device } from '../device/device';
import { Settings } from '../settings/settings';
import { ScanCamera } from '../scan-camera/scan-camera';
import { ScanSled } from '../scan-sled/scan-sled';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class Dashboard {
  
  listPage: Component;
  scanPage : Component;
  devicePage : Component;
  settingsPage : Component;

  constructor() {
    this.listPage = List;    
    this.devicePage = Device;
    this.settingsPage = Settings;

    // TODO: detect if scanner present and navigate based off of that
    let scanner = false,
      scanPage;
    if(scanner) {
      scanPage = ScanSled;
    } else {
      scanPage = ScanCamera;
    }
    this.scanPage = scanPage;
  }

}
