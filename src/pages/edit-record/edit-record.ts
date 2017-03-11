import { Component, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Content, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import * as moment from 'moment';

import { LeadsService } from '../../providers/leadsService';
import { InfoService } from '../../providers/infoService';
import { pickManyValidator } from '../../helpers/pickManyValidator';
import survey from '../../config/survey';

@Component({
  selector: 'page-edit-record',
  templateUrl: 'edit-record.html'
})
export class EditRecord {
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

  count : number = 0;
  

  constructor(public navCtrl: NavController, 
              params: NavParams, 
              public toastCtrl: ToastController, 
              public alertCtrl : AlertController,
              private formBuilder: FormBuilder,
              private leadsService: LeadsService ,
              private infoService : InfoService           
  ) {

    let formItems = survey.survey;
    this.contactObj = formItems.contact;
    this.qualifiersObj = formItems.qualifiers;
    this.leadrankingObj = formItems.leadRanking;
    this.notesObj = formItems.notes;

    this.person = params.data;
    let responses = this.person.Responses;
    this.firstName = responses.get('Tag', 'lcFirstName') || '';
    this.lastName = responses.get('Tag', 'lcLastName') || '';
    this.badgeId = responses.get('Tag', 'lcBadgeId') || '';
    this.company = responses.get('Tag', 'lcCompany') || '';

    // TODO: Import Form object
    this.recordForm = this.formBuilder.group(this.generateFreshForm());
    this.requiredFields = this.markRequiredFields(formItems);    
    
  }

  // Get Visits list
  ionViewWillEnter() {
    this.leadsService.findVisits(`ScanData=${this.person.ScanData}`).subscribe((data) => {
      this.visits = data;
    });

    if (window.navigator.onLine && this.infoService.leadsource.HasTranslation ) {
      this.leadsService.translate(this.person).subscribe((data) => {
        //alert(JSON.stringify(data));
        this.person.Translation = data;
      }, (err) => {
        let error = err.json();
        if (error.Fault && error.Fault.Type) {          
          let type = error.Fault.Type;
          if (type === 'AlreadyExistsFault') {}
          else if (type === 'InvalidSessionFault') {
            this.infoService.updateToken().flatMap(() => {
              return this.leadsService.translate(this.person);
            }).subscribe((d) => {
              //alert(JSON.stringify(d));
              this.person.Translation = d;
            }, (e) => {
              alert("ERROR: Still can't translate..");
              alert(JSON.stringify(e));
            });
          } else {}
        }
      })
    }
  }

  // Return Translation Id
  extractDisplayString(id) {   
    this.count++;
    if (this.count > 2500) {
      alert("WOAH");
    }
    if (this.person.Translation && this.person.Translation.Declarations) {
      let declarations = this.person.Translation.Declarations;
      let i = 0,
        j = declarations.length;
      for(; i < j; i++) {
        if (declarations[i].Id === id && declarations[i].CultureStrings && declarations[i].CultureStrings.length > 0) {
          return declarations[i].CultureStrings[0].DisplayString;          
        }
      }
      return "";
    }
  }

  // Parse date object into display string
  parseDate(dateStr) {
    if (dateStr) {
      return moment(dateStr, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('MMM DD, hh:mm A').toUpperCase();
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
    let validate = <any>[];
    if (item.type === 'TEXT' || item.type === 'TEXTAREA' || item.type === 'PICKONE') {
      validate.push(this.person.Responses.get('Tag', item.tag) || '');
      if (item.required) {
        validate.push(Validators.required);
      }
    } else if (item.type === 'PICKMANY') {
      // TODO: GET RESPONSE TAG FOR PICKMANY,PICKONE?, CHECKBOXES and SET VALUE
      if (item.required) {
        validate.push(Validators.compose([Validators.required, pickManyValidator]));
      }
    } else if (item.type === 'CHECKBOX') { 
      // TODO: GET RESPONSE TAG FOR PICKMANY,PICKONE?, CHECKBOXES and SET VALUE     
      if (item.required) {
        validate.push(Validators.pattern('true'));
      }
    }
    arr[item.tag] = validate;
  }

  // Alert user that data will be lost
  ionViewCanLeave() {
    if (!this.canExit && !this.recordForm.pristine) {
      let confirm = this.alertCtrl.create({
        title : "Leave without saving?",
        message: "Are you sure you want to exit this record without saving? All data will be lost.",
        buttons: [
          {
            text: "Stay",
            handler: () => {
              this.canExit = false;
            }
          }, 
          {
            text: "Leave",
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

  // Go to top of page
  scrollToTop() {
    this.contentPage.scrollToTop();
  }

  logForm() {
    console.log(this.recordForm);
  }

}
