import { Component, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Content, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import * as moment from 'moment';

import { LeadsService } from '../../providers/leadsService';
import { InfoService } from '../../providers/infoService';
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
  
  firstName : string = "";
  lastName : string = "";
  badgeId : string = "";
  company : string = "";
  notes : string = "";  

  person : any = {
    Translation : {},
    Responses : []
  };
  visits : any = [];
  translationFields : any = [];

  constructor(public navCtrl: NavController, 
              params: NavParams, 
              public toastCtrl: ToastController, 
              public alertCtrl : AlertController,
              private formBuilder: FormBuilder,
              private leadsService: LeadsService,
              private infoService: InfoService ) {

    let formItems = survey.survey;
    this.contactObj = formItems.contact;
    this.qualifiersObj = formItems.qualifiers;
    this.leadrankingObj = formItems.leadRanking;
    this.notesObj = formItems.notes;

    this.person = params.data;
    let responses = this.person.Responses;
    if (responses) {
      this.firstName = responses.get('Tag', 'lcFirstName') || '';
      this.lastName = responses.get('Tag', 'lcLastName') || '';
      this.badgeId = responses.get('Tag', 'lcBadgeId') || '';
      this.company = responses.get('Tag', 'lcCompany') || '';
    }

    this.recordForm = this.formBuilder.group(this.generateFreshForm());
    this.requiredFields = this.markRequiredFields(formItems);        
  }

  ionViewWillEnter() {

    // Get visits
    this.leadsService.findVisits(`ScanData=${this.person.ScanData}`).subscribe((data) => {
      this.visits = this.extractVisitsStrings(data);
    });

    // Get Translation
    if (window.navigator.onLine && this.infoService.leadsource.HasTranslation) {
      this.leadsService.translate(this.person).subscribe((data) => {
        this.person.Translation = data;
        this.translationFields = this.extractTranslationStrings(data.DataItems);
      }, (err) => {
        let error = err.json();
        if (error.Fault && error.Fault.Type) {          
          let type = error.Fault.Type;
          if (type === 'AlreadyExistsFault') {}
          else if (type === 'InvalidSessionFault') {
            this.infoService.updateToken().flatMap(() => {
              return this.leadsService.translate(this.person);
            }).subscribe((d) => {              
              this.person.Translation = d;
              this.translationFields = this.extractTranslationStrings(d.DataItems);
            }, (e) => {
              alert("ERROR: Still can't translate..");
              alert(JSON.stringify(e));
            });
          } else {}
        }
      });
    }
  }

  // Format translation data
  extractTranslationStrings(fields) {
    let arr = [];
    if (fields && this.person.Translation && this.person.Translation.Declarations) {
      let dec = this.person.Translation.Declarations,
          i = 0,
          j = fields.length,
          c = dec.length;
      for(; i < j; i++) {
        let id = fields[i].Id;
        let b = 0;
        for (; b < c; b++) {
          if (id === dec[b].Id) {
            if (dec[b].CultureStrings && dec[b].CultureStrings.length > 0 && dec[b].CultureStrings[0].DisplayString) {
              arr.push({ 
                title: dec[b].CultureStrings[0].DisplayString,
                value: fields[i].Value
              });
              break;
            }            
          }
        }
      }
    }
    return arr;
  }

  // Format visits strings
  extractVisitsStrings(v) {
    return v.map((visit) => {
      return {
        by: visit.CapturedBy,
        station : visit.CaptureStation,
        date : this.parseDate(visit.VisitDateTime)
      };
    });
  }

  // Parse date into display format
  parseDate(d) {
    if (d) {
      return moment(d, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('MMM DD, hh:mm A').toUpperCase();
    }
    return "";
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
    let validateArr = <any>[];             
    if (item.type === "TEXT" || item.type === 'TEXTAREA' || item.type === 'PICKONE') {
      validateArr.push(this.person.Responses.get('Tag', item.tag) || '');
      if (item.required) { 
        validateArr.push(Validators.required);
      }
    } else if (item.type === 'PICKMANY') {
      //validateArr.push(['lcBands_1', 'lcBands_3', 'lcBands_4']);
      validateArr.push('');
      if (item.required) { 
        validateArr.push(Validators.compose([Validators.required, pickManyValidator]));
      }
    } else if (item.type === 'CHECKBOX') {
      validateArr.push('');
      //validateArr.push(true);
      if (item.required) { 
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
