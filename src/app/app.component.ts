import { Component, ViewChild } from '@angular/core';
import { Nav, Platform} from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

// Side Menu Pages
import { Dashboard } from '../pages/dashboard/dashboard';
import { List } from '../pages/list/list';
import { Device } from '../pages/device/device';
import { Settings } from '../pages/settings/settings';
import { ScanCamera } from '../pages/scan-camera/scan-camera';
import { ScanSled } from '../pages/scan-sled/scan-sled';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Dashboard;

  pages: Array<{title: string, component: any, icon : string}>;

  constructor(public platform: Platform) {
    this.initializeApp();

    // TODO: convert 'sync leads' to action button, show scan camera vs scan sled
    let sled = true,
        scanPage;
    if (sled){
      scanPage = ScanSled;
    } else {
      scanPage = ScanCamera;
    }
    this.pages = [
      { title: 'Dashboard', component: Dashboard, icon : 'home'},
      { title: 'Add New Lead', component: scanPage, icon : 'add'},
      { title: 'View Leads', component: List, icon : 'list-box'},
      { title: 'Sync Leads', component: "", icon : 'refresh'},
      { title: 'Edit User', component: Device, icon : 'create'},
      { title: 'Settings', component: Settings, icon : 'settings'}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario   
    if(page.icon === 'refresh') {
      // TODO: SYNC content
      alert("SYNCING LEADS");
      return false;
    }
    this.nav.setRoot(page.component);
  }
}
