import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

// TESTING
const leads = [{
  firstName : "Julie", lastName: "Williams", company : "Validar, Inc.", date : "JUN 20, 2:34 PM"
}, {
  firstName : "Todd", lastName: "Bowels", company : "National Football League", date : "JUL 07, 1:54 PM"
}, {
  firstName : "Billy-Joe", lastName: "Maldwell", company : "Made in Washington", date : "DEC 20, 2:44 AM"
}, {
  firstName : "Jamison", lastName: "Bobberts", company : "IBM, inc.", date : "JUN 20, 4:35 PM"
}, {
  firstName : "Edward", lastName: "Minston", company : "Salesforce events", date : "MAY 20, 8:39 PM"
}, {
  firstName : "Scottopolis", lastName: "Messier", company : "Wells Fargo", date : "SEP 20, 11:30 AM"
}, {
  firstName : "Tyler", lastName: "Jackson", company : "Alphabet", date : "JAN 10, 12:34 PM"
}];

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class List {
  
  showSearch : Boolean = false;

  leads : Array<any>;

  constructor(public navCtrl: NavController) {
    this.leads = leads;
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

}
