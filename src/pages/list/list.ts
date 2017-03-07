import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { ScanSled } from '../scan-sled/scan-sled';
import { ScanCamera } from '../scan-camera/scan-camera';
import { Record } from '../record/record';

// TESTING
let leads = [{
  id: 1, firstName : "Julie", lastName: "Williams", company : "Validar, Inc.", date : "JUN 20, 2:34 PM"
}, {
  id: 2, firstName : "Todd", lastName: "Bowels", company : "National Football League", date : "JUL 07, 1:54 PM"
}, {
 id: 3,  firstName : "Billy-Joe", lastName: "Maldwell", company : "Made in Washington", date : "DEC 20, 2:44 AM"
}, {
 id: 4, firstName : "Jamison", lastName: "Bobberts", company : "IBM, inc.", date : "JUN 20, 4:35 PM"
}, {
 id: 5, firstName : "Edward", lastName: "Minston", company : "Salesforce events", date : "MAY 20, 8:39 PM"
}, {
 id: 6, firstName : "Scottopolis", lastName: "Messier", company : "Wells Fargo", date : "SEP 20, 11:30 AM"
}, {
 id: 7, firstName : "Tyler", lastName: "Jackson", company : "Alphabet", date : "JAN 10, 12:34 PM"
}];

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class List {
  
  showSearch : Boolean = false;

  leads : Array<any>;
  scanPage : Component;

  constructor(public navCtrl: NavController) {
    this.leads = leads;

    // TODO: convert 'sync leads' to action button, show scan camera vs scan sled
    let sled = true;
    if (sled){
      this.scanPage = ScanSled;
    } else {
      this.scanPage = ScanCamera;
    }
  }

  initializeList() {
    this.leads = leads;
  }

  filterLeads(ev) {
    this.initializeList();
    let val = ev.target.value;

    if (val && val.trim() != "") {
      val = val.toLowerCase();
      this.leads = this.leads.filter((item) => {
        let first = item.firstName.toLowerCase(),
          last = item.lastName.toLowerCase(),
          company = item.company.toLowerCase();
          console.log(first, last, company);
        if(first.indexOf(val) > -1) {
          return true;
        } else if (last.indexOf(val) > -1) {
          return true;
        } else if (company.indexOf(val) > -1) {
          return true;
        }
      });
      console.log(this.leads);
    }
  }

  toggleSearchBox() {
    this.showSearch = !this.showSearch;
    if(!this.showSearch) {
      this.initializeList();
    }
  }

  editRecord(id) {    
    this.navCtrl.push(Record);
  }

  deleteRecord(id) {
    leads = leads.filter((lead) => lead.id !== id);
    this.initializeList();
  }

}
