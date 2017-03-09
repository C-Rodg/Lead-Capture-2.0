import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import * as moment from 'moment';

import { ScanSled } from '../scan-sled/scan-sled';
import { ScanCamera } from '../scan-camera/scan-camera';
import { EditRecord } from '../edit-record/edit-record';

import { LeadsService } from '../../providers/leadsService';
import { SettingsService } from '../../providers/settingsService';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class List {
  
  showSearch : Boolean = false;

  leads : Array<any> =[];
  filteredLeads : Array<any> = [];
  scanPage : Component;

  constructor(public navCtrl: NavController, 
    public alertCtrl: AlertController,
    private leadsService : LeadsService,
    private settingsService : SettingsService 
    ) {

    // TODO: convert 'sync leads' to action button, show scan camera vs scan sled
    let sled = true;
    if (sled){
      this.scanPage = ScanSled;
    } else {
      this.scanPage = ScanCamera;
    }
  }

  // Get leads from database
  ionViewWillEnter() {
    let query  = this.settingsService.showDeleted ? '' : 'deleted=no';
    this.leadsService.find(query).subscribe((data) => {
      this.leads = this.parseLeadsInfo(data);
      this.filteredLeads = this.leads;
    });
  }

  // Take response from 'find' and parse into data for list view
  parseLeadsInfo(fullLeads) {
    return fullLeads.map((lead) => {
      let firstName = lead.Responses.get('Tag', 'lcFirstName') || lead.Responses.get('Tag', 'lcBadgeId') || '';
      let lastName = lead.Responses.get('Tag', 'lcLastName') || '';
      let company = lead.Responses.get('Tag', 'lcCompany') || '';
      let time = moment(lead.LastVisitDateTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('MMM DD, HH:mm A').toUpperCase();
      let deleted = lead.DeleteDateTime;
      return {
        id : lead.LeadGuid,
        time,
        firstName,
        lastName,
        company,
        deleted
      };
    });
  }

  // Filter by First, Last, Company
  filterLeads(ev) {
    let val = ev.target.value.toUpperCase();
    this.filteredLeads = this.leads.filter((reg) => {
      return (reg.firstName.toUpperCase().indexOf(val) > -1) || (reg.lastName.toUpperCase().indexOf(val) > -1) || (reg.company.toUpperCase().indexOf(val) > -1);
    });
  }

  // Show / Hide search box and remove filter
  toggleSearchBox() {
    this.showSearch = !this.showSearch;
    if(!this.showSearch) {
     this.filteredLeads = this.leads;
    }
  }

  // Click handler for editing record
  editRecord(id) {    
    this.navCtrl.push(EditRecord);
  }

  // Click handler for deleting record
  deleteRecord(id) {
    let confirm = this.alertCtrl.create({
      title: "Delete this record?",
      message: "Are you sure you want to delete this record? All data will be lost.",
      buttons: [
        {
          text: "Cancel"
        }, {
          text: "Delete",
          handler: () => {
            // TODO: HANDLE DELETING AND REMOVE from LEADS
          }
        }
      ]
    });
    confirm.present();
    return false;  
  }

  // Click handler for undeleting record
  undeleteRecord(id) {
    // TODO: HANDLE UNDELETING A RECORD
  }

}
