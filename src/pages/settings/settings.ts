import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

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
  
  constructor(public navCtrl: NavController,
    private toastCtrl : ToastController,
    private settingsService: SettingsService,
    private infoService : InfoService,
    private leadsService : LeadsService
  ) {
    this.devicePage = Device;       
  }  

  // Get Lead counts on view load
  ionViewWillEnter() {  
    this.getLeadCounts();
  }

  // Sync leads 
  syncLeads() {
    this.leadsService.translateAndUpload()
      .subscribe((data) => {
        let toast = this.toastCtrl.create({
          message: "Finished syncing leads!",
          duration: 2500,
          position: 'top'
        });
        toast.present();
        this.getLeadCounts();
      }, (err) => {
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

  // Settings changed, save to local storage
  saveSettings() {
    this.settingsService.storeCurrentSettings();
  }

  // Navigate to Root
  navigateToEventList() {
    window.location.href = "http://localhost/navigate/home";
  }

}
