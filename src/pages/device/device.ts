import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { AddModal } from './add-modal/add-modal';

@Component({
  selector: 'page-device',
  templateUrl: 'device.html'
})
export class Device {

  // FOR TESTING:
  users : Array<string>;
  stations : Array<string>;
  selectedUser : string;
  selectedStation : string;

  constructor(public navCtrl: NavController, public modalCtrl : ModalController) {
    
    // FOR TESTING:
    this.users = ["Booth Station", "Tommy Douglas", "Johnny Walker"];
    this.selectedUser = this.users[1];    
    this.stations = ["Booth", "Meeting", "Session", "Other"];
    this.selectedStation = this.stations[2];
  }

  // Select a User/Station
  selectSetting(type, val) {
    if(type === 'user') {
      this.selectedUser = val;
    } else if (type === 'station') {
      this.selectedStation = val;
    }
  }

  // Delete a User/Station
  deleteSetting(type, idx) {
    if(type === 'user'){
      this.users.splice(idx, 1);
    } else if (type === 'station') {
      this.stations.splice(idx, 1);
    }
  }
  
  // Navigate to Modal for User/Station - Edit or New mode
  navToModal(user, editValue, editIdx) {
    if(user === 'user') {
      let modal = this.modalCtrl.create(AddModal, {mode: 'User', edit: editValue, editIdx : editIdx});
      modal.onDidDismiss(data => {
        if(data.save){
          this.selectedUser = data.val;
          if(data.hasOwnProperty('editIndex')) {
            this.users[data.editIndex] = data.val;
          } else {
            this.users.push(data.val);
          }
        }
      });
      modal.present();
    } else if (user === 'station') {
      let modal = this.modalCtrl.create(AddModal, {mode: 'Station', edit: editValue, editIdx : editIdx});
      modal.onDidDismiss(data => {
        if(data.save) {
          this.selectedStation = data.val;
          if(data.hasOwnProperty('editIndex')) {
            this.stations[data.editIndex] = data.val;
          } else {
            this.stations.push(data.val);
          }
        }
        
      });
      modal.present();
    }
  }

}
