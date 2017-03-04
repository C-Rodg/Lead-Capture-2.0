import { Component, ViewChild, NgZone } from '@angular/core';
import { Nav, Platform} from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

// Side Menu Pages
import { Dashboard } from '../pages/dashboard/dashboard';
import { List } from '../pages/list/list';
import { Device } from '../pages/device/device';
import { Settings } from '../pages/settings/settings';
import { ScanCamera } from '../pages/scan-camera/scan-camera';
import { ScanSled } from '../pages/scan-sled/scan-sled';

import { InfoService } from '../providers/infoService';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Dashboard;

  pages: Array<{title: string, component: any, icon : string}>;

  constructor(public platform: Platform, 
    private infoService: InfoService,
    private zone: NgZone  
  ) {
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
      { title: 'Settings', component: Settings, icon : 'settings'},
      { title: 'Exit', component: "", icon : "exit"}
    ];
    
    // Get Token, seats
    this.infoService.startUpApplication().subscribe((data) => {
        // All Good!
    }, (error) => {
      alert("There was an error logging in...");
      alert(JSON.stringify(error));
    });

    // OnAppActive Event from Linea
    (<any>window).OnLineaConnect = this.onZoneOnAppActive.bind(this);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  onZoneOnAppActive() {
    this.zone.run(() => {
      this.infoService.getClientInfo().subscribe(() => {});
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario   
    if(page.icon === 'refresh') {
      // TODO: SYNC content
      alert("SYNCING LEADS");
      return false;
    } else if (page.icon === "exit") {
      window.location.href = "http://localhost/navigate/home";
      return false;
    }
    this.nav.setRoot(page.component);
  }
}
