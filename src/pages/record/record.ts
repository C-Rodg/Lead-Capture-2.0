import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';

import { pickManyValidator } from '../../helpers/pickManyValidator';

import survey from './survey';
console.log(survey);

@Component({
  selector: 'page-record',
  templateUrl: 'record.html'
})
export class Record {
  capturePage : string = "contact";
  canExit : boolean = false;
  recordForm : FormGroup;
  
  firstName;
  lastName;
  badgeId;
  company;
  notes : string = "";    

  constructor(public navCtrl: NavController, 
              params: NavParams, 
              public toastCtrl: ToastController, 
              public alertCtrl : AlertController,
              private formBuilder: FormBuilder) {

    // TODO: Parse out data passed...
    // let person = params.data;
    // this.firstName = person.firstName,
    // this.lastName = person.lastName,
    // this.badgeId = person.badgeId,
    // this.company = person.company;

    

    // TODO: Import Form object
    this.recordForm = this.formBuilder.group({
      leadRanking : this.formBuilder.group({
        lcLeadRank : [""]
      }),
      contact : this.formBuilder.group({
        lcFirstName : ['', Validators.required],
        lcLastName : ['', Validators.required],
        lcCompany : ['', Validators.required],
        lcEmail : [''],
        lcAddress1 : [''],
        lcCity : [''],
        lcZip : [''],
        lcState : [''],
        lcCountry: [''],
        lcPhone: [''],
        lcFax: [''],
        lcMobile: ['']
      }),
      qualifiers : this.formBuilder.group({
        lcProductList : [''],
        lcPrivacy_Yes : [false],    // Validators.pattern('true')
        lcControllers : [''],
        lcProducts : ['', Validators.required], // Validators.required
        lcColor : [''],
        lcBands : ['', Validators.compose([Validators.required, pickManyValidator])],
        lcContactMe : [''],
        lcConcerns : [''],
        lcComments : ['']
      }),
      notes : this.formBuilder.group({
        lcNotes : ['']      // Validators.required
      })
    });
    
  }

  ionViewCanLeave() {
    if (!this.canExit) {
      let confirm = this.alertCtrl.create({
        title : "Leave without saving?",
        message: "Are you sure you want to exit this record without saving? All data will be lost.",
        buttons: [
          {
            text: "No",
            handler: () => {
              this.canExit = false;
            }
          }, 
          {
            text: "Yes",
            handler: () => {
              this.canExit = true;
              this.navCtrl.pop();
            }
          }
        ]
      });
      confirm.present();
      return false;
    }
    return true;
  }

  saveRecord() {
    // Check for required fields
    if (!this.recordForm.valid) {
      let toast = this.toastCtrl.create({
        message: "... is a required field.",
        duration: 3000,
        position: 'top'
      });
      toast.present();
      return false;
    }

    // All good, save record
    this.canExit = true;
    
    // Show confirmation and return to scan page
    let toast = this.toastCtrl.create({
      message: "Record was successfully saved!",
      duration: 2500,
      position: 'top'
    });
    toast.present();
    this.navCtrl.pop();
  }

  logForm() {
    console.log(this.recordForm);
  }

}
