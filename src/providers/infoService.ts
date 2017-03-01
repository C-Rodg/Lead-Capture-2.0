import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { LeadSourceGuid } from '../helpers/leadSourceGuid';

@Injectable()
export class InfoService {

    public client : any = [];
    public leadsource : any = [];

    constructor(private http: Http) {        
    }

    async() {
        let clientXHR = new Promise((resolve, reject) => {
            this.http.get('http://localhost/clientinfo').map((res) => res.json()).subscribe((data) => { 
                this.client = data;
                resolve(data);
            });
        });
        let lsXHR = new Promise((resolve, reject) => {
            this.http.get('http://localhost/leadsources/' + LeadSourceGuid.guid).map((res) => res.json()).subscribe((data) => { 
                this.leadsource = data.LeadSource;
                resolve(data);
            });
        });
        return Promise.all([clientXHR, lsXHR]);        
    }
}