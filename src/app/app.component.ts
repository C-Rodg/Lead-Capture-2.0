import { Component, ViewChild, NgZone } from '@angular/core';
import { Nav, Platform, ToastController, LoadingController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

// Side Menu Pages
import { Dashboard } from '../pages/dashboard/dashboard';
import { List } from '../pages/list/list';
import { Device } from '../pages/device/device';
import { Settings } from '../pages/settings/settings';
import { ScanCamera } from '../pages/scan-camera/scan-camera';
import { ScanSled } from '../pages/scan-sled/scan-sled';

import { InfoService } from '../providers/infoService';
import { SettingsService } from '../providers/settingsService';
import { LeadsService } from '../providers/leadsService';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Dashboard;

  pages: Array<{title: string, component: any, icon : string, count?: number}>;
  pendingUploads : number = 0;

  constructor(public platform: Platform, 
    private infoService: InfoService,
    private settingsService : SettingsService,
    private leadsService : LeadsService,
    private zone: NgZone,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
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
      { title: 'Sync Leads', component: "", icon : 'refresh' },
      { title: 'Edit User', component: Device, icon : 'create'},
      { title: 'Settings', component: Settings, icon : 'settings'},
      { title: 'Exit', component: "", icon : "exit"}
    ];
    
    // Get Token, seats
    this.infoService.startUpApplication().subscribe((data) => {
        // All Good!
        this.getPendingCount();
        this.startBackgroundUpload();
    }, (error) => {      
      // Currently do nothing...?
    });

    // OnAppActive Event from Linea
    (<any>window).OnLineaConnect = this.onZoneOnAppActive.bind(this);
  }

  // Start up application, plugins are available
  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  //  When Linea connects, update client info
  onZoneOnAppActive() {
    this.zone.run(() => {
      this.infoService.getClientInfo().subscribe(() => {});
    });
  }

  // Click handler for side menu items
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario   
    if(page.icon === 'refresh') {
      let loader = this.loadingCtrl.create({
        content: 'Syncing leads...',
        dismissOnPageChange: true
      });
      loader.present();
      this.translateAndUpload().subscribe((data) => {
        loader.dismiss();
        let toast = this.toastCtrl.create({
          message: "Finished syncing leads!",
          duration: 2500,
          position: 'top'
        });
        toast.present();
        this.getPendingCount();
      }, (err) => {
        loader.dismiss();
        let toast = this.toastCtrl.create({
          message: err,
          duration: 2500,
          position: 'top'
        });
        toast.present();
        this.getPendingCount();
      });
      return false;
    } else if (page.icon === "exit") {
      window.location.href = "http://localhost/navigate/home";
      return false;
    } else {
      this.nav.setRoot(page.component);
    }    
  }

  // Helper - Translate and Upload pending 
  translateAndUpload() {
    return this.leadsService.translateAndUpload();
  }

  // Get pending upload count
  getPendingCount() {
    this.leadsService.count('?uploaded=no').subscribe((data) => {
      // Zone required for updating menu view
      this.zone.run(() => {
        this.pendingUploads = data.Count;
      });      
    }, (err) => {
    });
  }

  // Start interval for background upload
  startBackgroundUpload() {    
      this.leadsService.initializeBackgroundUpload(this.settingsService.backgroundUploadWait);
  }

}
