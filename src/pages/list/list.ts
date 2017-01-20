import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class List {
  
  showSearch : Boolean = false;

  constructor(public navCtrl: NavController) {
    
  }

  toggleSearchBox() {
    this.showSearch = !this.showSearch;
  }

}
