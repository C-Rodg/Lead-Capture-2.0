import { Component } from '@angular/core';

import { List } from '../list/list';
import { Scan } from '../scan/scan';
import { Device } from '../device/device';
import { Settings } from '../settings/settings';

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
    this.scanPage = Scan;
    this.devicePage = Device;
    this.settingsPage = Settings;
  }

}
