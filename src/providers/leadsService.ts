import { Injectable } from '@angular/core';
import { LeadSourceGuid } from '../helpers/leadSourceGuid';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

Array.prototype['get'] = function(propName, tag) {
    let i = 0,
        j = this.length;
    for (; i < j; i++) {
        if ("object" == typeof this[i] && this[i][propName] === tag) {
            return this[i].Value;
        }
    }
};

@Injectable()
export class LeadsService {
    constructor(private http: Http) {
        console.log("Creating LEADS SERVICE");
    }

    load(leadGuid) {
        return this.http.get(`http://localhost/leadsources/${LeadSourceGuid.guid}/leads/${leadGuid}`).map(res => res.json());
    }

    find(query) {
        return this.http.get(`http://localhost/leadsources/${LeadSourceGuid.guid}/leads?${query}`).map(res => res.json());
    }

    count(query) {
        return this.http.get(`http://localhost/leadsources/${LeadSourceGuid.guid}/leads/count${query}`).map(res => res.json());
    }

    saveNew(lead) {
        return this.http.put(`http://localhost/leadsources/${LeadSourceGuid.guid}/leads`, lead).map(res => res.json());
    }

    saveReturning(lead, leadGuid) {
        return this.http.put(`http://localhost/leadsources/${LeadSourceGuid.guid}/leads/${leadGuid}`, lead).map(res => res.json());
    }

    markDeleted(leadGuid) {
        return this.http.put(`http://localhost/leadsources/${LeadSourceGuid.guid}/leads/${leadGuid}/deleted`, {}).map(res => res.json());
    }

    markUndeleted(leadGuid) {
        return this.http.put(`http://localhost/leadsources/${LeadSourceGuid.guid}/leads/${leadGuid}/undeleted`, {}).map(res => res.json());
    }

    markUploaded(leadGuid) {
        return this.http.put(`http://localhost/leadsources/${LeadSourceGuid.guid}/leads/${leadGuid}/uploaded`, {}).map(res => res.json());
    }

    updateTranslation(leadGuid, translation) {
        return this.http.put(`http://localhost/leadsources/${LeadSourceGuid.guid}/leads/${leadGuid}/translation`, translation).map(res => res.json());
    }

    saveVisit(lead) {
        return this.http.put(`http://localhost/leadsources/${LeadSourceGuid.guid}/visits`, lead).map(res => res.json());
    }

    getVisits(query) {
        return this.http.get(`http://localhost/leadsources/${LeadSourceGuid.guid}/visits${query}`, {}).map(res => res.json());
    }

    upload() {

    }

    translate() {

    }
}