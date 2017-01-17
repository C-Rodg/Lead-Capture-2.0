import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { UserModal } from './userModal/userModal';
import { StationModal } from './stationModal/stationModal';

@Component({
  selector: 'page-device',
  templateUrl: 'device.html'
})
export class Device {

  constructor(public navCtrl: NavController, public modalCtrl : ModalController) {
    
  }

  addUser() {
    let modal = this.modalCtrl.create(UserModal);
    modal.present();
  }

  addStation() {
    let modal = this.modalCtrl.create(StationModal);
    modal.present();
  }

}
