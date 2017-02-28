import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { AddModal } from './add-modal/add-modal';
import { SettingsService } from '../../providers/settingsService';

@Component({
  selector: 'page-device',
  templateUrl: 'device.html'
})
export class Device {

  constructor(public navCtrl: NavController, public modalCtrl : ModalController, private settingsService: SettingsService) { }

  // Select a User/Station
  selectSetting(type, val) {
    if(type === 'user') {
      this.settingsService.setValue(val, 'currentUser');
    } else if (type === 'station') {
      this.settingsService.setValue(val, 'currentStation');
    }
  }

  // Delete a User/Station
  deleteSetting(type, idx) {
    if(type === 'user'){
      if (this.settingsService.users[idx] === this.settingsService.currentUser){
        this.settingsService.setValue("", "currentUser");
      }
      this.settingsService.deleteArraySetting(idx, 'users');
    } else if (type === 'station') {
      if (this.settingsService.stations[idx] === this.settingsService.currentStation) {
        this.settingsService.setValue("", "currentStation");
      }
      this.settingsService.deleteArraySetting(idx, 'stations');
    }
  }
  
  // Navigate to Modal for User/Station - Edit or New mode
  navToModal(user, editValue, editIdx) {
    if(user === 'user') {
      let modal = this.modalCtrl.create(AddModal, {mode: 'User', edit: editValue, editIdx : editIdx});
      modal.onDidDismiss(data => {
        if(data.save){          
          this.settingsService.setValue(data.val, 'currentUser');
          if(data.hasOwnProperty('editIndex')) {
            this.settingsService.setArraySetting(data.val, data.editIndex, 'users');            
          } else {
            this.settingsService.pushArraySetting(data.val, 'users');
          }
        }
      });
      modal.present();
    } else if (user === 'station') {
      let modal = this.modalCtrl.create(AddModal, {mode: 'Station', edit: editValue, editIdx : editIdx});
      modal.onDidDismiss(data => {
        if(data.save) {
          this.settingsService.setValue(data.val, 'currentStation');
          if(data.hasOwnProperty('editIndex')) {
            this.settingsService.setArraySetting(data.val, data.editIndex, 'stations');
          } else {
            this.settingsService.pushArraySetting(data.val, 'stations');            
          }
        }
        
      });
      modal.present();
    }
  }

}
