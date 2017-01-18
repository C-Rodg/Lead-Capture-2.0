import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  selector: 'add-modal',
  templateUrl: 'add-modal.html'
})
export class AddModal {
    
    mode : string;
    titleStr : string;
    placeholderStr : string;
    inputVal : string;
    isEdit : boolean;
    editIdx : Number;

    constructor(public viewCtrl: ViewController, public params: NavParams) {
        this.mode = this.params.get('mode');
        let editMode = this.params.get('edit');
        if(editMode) {
          this.isEdit = true;
          this.editIdx = this.params.get('editIdx');
          this.titleStr = "Edit " + this.mode;
          this.placeholderStr = "Edit " + this.mode;
        } else {
          this.isEdit = false;
          this.titleStr = "Add " + this.mode;
          this.placeholderStr = "New " + this.mode;
        }
        this.inputVal = editMode;
    }

    dismiss() {
      this.viewCtrl.dismiss({save: false, val : this.inputVal});
    }

    saveNewDevice() {      
      let dataObj = {
        save : true,
        val : this.inputVal
      };
      if(this.isEdit){
        dataObj['editIndex'] = this.editIdx; 
      }
      if(!this.inputVal){
        dataObj['save'] = false;
      }
      this.viewCtrl.dismiss(dataObj);
    }
}