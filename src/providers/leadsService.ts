import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';

import { InfoService } from './infoService';
import { LeadSourceGuid } from '../helpers/leadSourceGuid';

Array.prototype['get'] = function(propName, tag) {
    let i = 0,
        j = this.length;
    for (; i < j; i++) {
        if ("object" == typeof this[i] && this[i][propName] === tag) {
            return this[i].Value;
        }
    }
};

Array.prototype['getPicks'] = function(propName, tag) {
    let i = 0,
        j = this.length;
    for (; i < j; i++) {
        if (typeof this[i] == "object" && this[i][propName] === tag) {
            return this[i].Picked;
        }
    }
};

@Injectable()
export class LeadsService {
    constructor(private http: Http,
            private infoService : InfoService
    ) {

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

    findVisits(query) {
        return this.http.get(`http://localhost/leadsources/${LeadSourceGuid.guid}/visits?${query}`).map(res => res.json());
    }    

    upload() {

    }

    // Translate Record
    translate(record) {
        let trans = null;
        return this.infoService.getSeat().flatMap((newSeat) => {
            let seat = newSeat.SeatGuid;
            let url = `${this.infoService.leadsource.LeadSourceUrl}/Translate/${LeadSourceGuid.guid}/${seat}`;
            let req = {
                "Source" : record.ScanData,
                "RequestingApplication": record.LeadGuid,
                "RequestingClientGuid": this.infoService.client.ClientGuid
            };

            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', `ValidarSession token="${this.infoService.getCurrentToken()}"`);
            return this.http.post(url, req, { headers }).map(res => res.json());
        }).flatMap((transObj) => {
            transObj["Status"] = transObj.TranslationStatus;
            delete transObj.TranslationStatus;
            trans = transObj;
            return this.updateTranslation(record.LeadGuid, transObj);
        }).flatMap(() => {
            return Observable.of(trans);
        });
    }
}