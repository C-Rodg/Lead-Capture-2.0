import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController, Events } from 'ionic-angular';

import { Device } from '../device/device';
import { SettingsService } from '../../providers/settingsService';
import { InfoService } from '../../providers/infoService';
import { LeadsService } from '../../providers/leadsService';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class Settings {
  devicePage : Component;
  pendingUpload : number = 0;
  pendingTranslation : number = 0;
  aboutDevice : any = {
    appInfo : "",
    deviceInfo : "",
    scannerStatus: "disconnected",
    cameraFront: "checkmark",
    cameraBack: "checkmark"
  };
  
  constructor(public navCtrl: NavController,
    private toastCtrl : ToastController,
    private loadingCtrl : LoadingController,
    private events: Events,
    private settingsService: SettingsService,
    private infoService : InfoService,
    private leadsService : LeadsService
  ) {
    this.devicePage = Device;       
  }  

  // Get Lead counts on view load
  ionViewWillEnter() {  
    this.buildAboutSection();
    this.getLeadCounts();
    this.events.subscribe('event:onLineaConnect', this.buildAboutSection);
  }

  // Unsubscribe to events 
  ionViewWillLeave() {
    this.events.unsubscribe('event:onLineaConnect', this.buildAboutSection);
  }

  // Get About section
  buildAboutSection() {
     let a = this.aboutDevice;
     a.appInfo = this.infoService.getApplicationInformation();
     a.deviceInfo = this.infoService.getDeviceInformation();
     a.scannerStatus = (this.infoService.getLineaStatus()) ? 'connected' : 'disconnected';
     a.cameraFront = (this.infoService.getCameraStatus('FrontCamera')) ? 'checkmark' : 'close';
     a.cameraBack = (this.infoService.getCameraStatus('RearCamera')) ? 'checkmark' : 'close';
  }

  // Sync leads 
  syncLeads() {
    let loader = this.loadingCtrl.create({
      content: 'Syncing leads...',
      dismissOnPageChange: true
    });
    loader.present();
    this.leadsService.translateAndUpload()
      .subscribe((data) => {
        loader.dismiss();
        let toast = this.toastCtrl.create({
          message: "Finished syncing leads!",
          duration: 2500,
          position: 'top'
        });
        toast.present();
        this.getLeadCounts();
      }, (err) => {
        loader.dismiss();
        let toast = this.toastCtrl.create({
          message: err,
          duration: 2500,
          position: 'top'
        });
        toast.present();
        this.getLeadCounts();
      });
  } 

  // Resync ALL leads - translate and re-upload 
  resyncAllLeads() {
    let loader = this.loadingCtrl.create({
      content: 'Resyncing all leads',
      dismissOnPageChange: true
    });
    loader.present();
    this.leadsService.translateAndUploadAll()
      .subscribe((data) => {
        loader.dismiss();
        let toast = this.toastCtrl.create({
          message: "Finished resyncing everything!",
          duration: 2500,
          position: 'top'
        });
        toast.present();
        this.getLeadCounts();
      }, (err) => {
        loader.dismiss();
        let toast = this.toastCtrl.create({
          message: err,
          duration: 2500,
          position: 'top'
        });
        toast.present();
        this.getLeadCounts();
      });
  }

  // Toggle change event
  refreshCounts() {
    this.getLeadCounts();
    this.settingsService.storeCurrentSettings();
  }

  // Refresh pending and translated counts
  getLeadCounts() {
    this.leadsService.count('?uploaded=no').subscribe((data) => {
      this.pendingUpload = data.Count;
    }, (err) => {});

    this.leadsService.count('?translated=no').subscribe((data) => {
      this.pendingTranslation = data.Count;
    }, (err) => {});
  }

  // Set new automatic upload time
  startNewUploadTime() {
    this.settingsService.storeCurrentSettings();
    this.leadsService.initializeBackgroundUpload(this.settingsService.backgroundUploadWait);
  }

  // Settings changed, save to local storage
  saveSettings() {
    this.settingsService.storeCurrentSettings();
  }

  // Navigate to Root
  navigateToEventList() {
    window.location.href = "http://localhost/navigate/home";
  }

}
