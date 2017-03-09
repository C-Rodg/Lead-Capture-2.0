import { Component, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Content, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';

import { pickManyValidator } from '../../helpers/pickManyValidator';

import survey from '../../config/survey';

@Component({
  selector: 'page-new-record',
  templateUrl: 'new-record.html'
})
export class NewRecord {
  @ViewChild(Content) contentPage : Content;

  capturePage : string = "contact";
  canExit : boolean = false;
  recordForm : FormGroup;

  contactObj : any = [];
  qualifiersObj : any = [];
  leadrankingObj : any = [];
  notesObj : any = [];

  requiredFields : any = [];
  
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

    let formItems = survey.survey;
    this.contactObj = formItems.contact;
    this.qualifiersObj = formItems.qualifiers;
    this.leadrankingObj = formItems.leadRanking;
    this.notesObj = formItems.notes;

    // TODO: Parse out data passed...
    // let person = params.data;
    // this.firstName = person.firstName,
    // this.lastName = person.lastName,
    // this.badgeId = person.badgeId,
    // this.company = person.company;     

    // TODO: Import Form object
    this.recordForm = this.formBuilder.group(this.generateFreshForm());
    this.requiredFields = this.markRequiredFields(formItems);    
    
  }

  // Determine which fields are required for form submission
  markRequiredFields(form) {
    const { contact, qualifiers, notes, leadRanking } = form;
    let reqs = {};
    [contact, qualifiers, notes, leadRanking].forEach((group) => {
      group.forEach((question) => {
        if (question.required) {
          reqs[question.tag] = question.prompt;          
        }
      });
    });
    return reqs;
  }

  // Generate the 3-page form - contact, qualifiers, notes + leadranking
  generateFreshForm() {
    let leadRanking = {},
        contact = {},
        qualifiers = {},
        notes = {},
        form = survey.survey,
        obj = {};

    form.contact.forEach((item) => {
      this.createQuestionFormGroup(item, contact);
    });
    form.leadRanking.forEach((item) => {
      this.createQuestionFormGroup(item, leadRanking);
    });
    form.notes.forEach((item) => {
      this.createQuestionFormGroup(item, notes);
    });
    form.qualifiers.forEach((item) => {
      this.createQuestionFormGroup(item, qualifiers);
    });

    obj['leadRanking'] = this.formBuilder.group(leadRanking);
    obj['contact'] = this.formBuilder.group(contact);
    obj['notes'] = this.formBuilder.group(notes);
    obj['qualifiers'] = this.formBuilder.group(qualifiers);

    return obj;
  }

  // Create the validation object
  createQuestionFormGroup(item, arr) {
    let validateArr = <any>[''];
      if (item.required) {        
        if (item.type === "TEXT" || item.type === 'TEXTAREA' || item.type === 'PICKONE') {
          validateArr.push(Validators.required);
        } else if (item.type === 'PICKMANY') {
          validateArr.push(Validators.compose([Validators.required, pickManyValidator]));
        } else if (item.type === 'CHECKBOX') {
          validateArr.push(Validators.pattern('true'));
        }        
      }
      arr[item.tag] = validateArr;
  }

  // Alert user that data will be lost
  ionViewCanLeave() {
    if (!this.canExit && !this.recordForm.pristine) {
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

  // Validate form
  searchForInvalidField(form) {    
    const { contact, leadRanking, qualifiers, notes } = form;
    for (let group of [contact, leadRanking, qualifiers, notes]) {
      if (!group.valid) {
        let controls = group.controls;
        for (let prop in controls) {
          if (controls.hasOwnProperty(prop) && !controls[prop].valid) {
            return prop;
          }
        }
      }
    }
  }

  // Save form
  saveRecord() {
    // Check for required fields
    if (!this.recordForm.valid) {
      let reqField = this.requiredFields[this.searchForInvalidField(this.recordForm.controls)];
      let toast = this.toastCtrl.create({
        message: `${reqField} is required.`,
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

  scrollToTop() {
    this.contentPage.scrollToTop();
  }

  logForm() {
    console.log(this.recordForm);
  }

}
