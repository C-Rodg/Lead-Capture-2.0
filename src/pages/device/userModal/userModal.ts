import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'userModal',
  templateUrl: 'userModal.html'
})
export class UserModal {
    constructor(public viewCtrl: ViewController) {
        
    }

    dismiss() {
      this.viewCtrl.dismiss();
    }

    saveNewUser() {
      // TODO: SAVE NEW User 
      this.viewCtrl.dismiss();
    }
}