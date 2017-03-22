import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

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
    
    backgroundInterval : any;

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

    // Upload the current lead
    upload(lead) {
        let seat = null;
        return this.infoService.getSeat()
        .flatMap((newSeat) => {        
            seat = newSeat.SeatGuid;            
            return Observable.of(seat);
        })
        .flatMap(() => this.findVisits(`ScanData=${lead.ScanData}`))
        .flatMap((visits) => {
            let visitTimes = [],
                localTime = null;

            // Create visits array
            visits.forEach((visit) => {
                if (visit.VisitDateTime) {
                    const capturedBy = visit.CapturedBy ? visit.CapturedBy : "";
                    const captureStation = visit.CaptureStation ? visit.CaptureStation : "";
                    localTime = moment.utc(visit.VisitDateTime).toDate();
                    visitTimes.push(`${moment(localTime).format("YYYY-MM-DD HH:mm:ss")} | ${capturedBy} | ${captureStation}`);
                }
            });

            // Add/Edit lcVisitDateTimes            
            if ( visitTimes.length > 0 ) {
                let n = {
                    Tag : 'lcVisitDateTimes',
                    Value : visitTimes.join('^^')
                };
                this.searchForDupes(lead, 'lcVisitDateTimes', n);                
            }

            // Add/Edit lcFirstVisitDate
            if ( lead.CreateDateTime ) {
                let createLocalTimeDate = moment.utc( lead.CreateDateTime ).toDate();
                let createLocalTime = moment(createLocalTimeDate).format('YYYY-MM-DD HH:mm:ss');
                let n = {
                    Tag : 'lcFirstVisitDate',
                    Value : createLocalTime
                };
                this.searchForDupes(lead, 'lcFirstVisitDate', n);
            }

            // Add/Edit lcUpdateDateTime
            if ( lead.UpdateDateTime ) {
                let updateLocalTimeDate = moment.utc(lead.UpdateDateTime).toDate();
                let updateLocalTime = moment(updateLocalTimeDate).format('YYYY-MM-DD HH:mm:ss');
                let n = {
                    Tag : 'lcUpdateDateTime',
                    Value : updateLocalTime
                };
                this.searchForDupes(lead, 'lcUpdateDateTime', n);
            }

            let translateKeys = null;
            if (lead.Translation !== null) {
                translateKeys = lead.Translation.Keys;
            }

            let markDeleted = lead.DeleteDateTime !== null;

            let req = {
                SourceApplicationId: lead.LeadGuid,
                AcquisitionUtcDateTime: lead.CreateDateTime,
                Keys: lead.Keys,
                TranslateKeys: translateKeys,
                Responses : lead.Responses,
                MarkedAsDeleted: markDeleted
            };

            let url = `${this.infoService.leadsource.LeadSourceUrl}/UpsertLead/${LeadSourceGuid.guid}/${seat}`;
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', `ValidarSession token="${this.infoService.getCurrentToken()}"`);
            console.log(req);
            return this.http.post(url, req, { headers }).map(res => res.json())
                .flatMap(() => {
                    return this.markUploaded((lead.LeadGuid));
                })
                .catch((err) => {                    
                    if (err && err.Fault && err.Fault.Type) {
                        if (err.Fault.Type === "InvalidSessionFault") {
                            return this.infoService.updateToken().flatMap(() => this.upload(lead));
                        } 
                    }
                    return Observable.throw(err);
                });
        });
    }

    // Upload pending records 
    uploadPending() {
        if (!window.navigator.onLine) {
            return Observable.throw("Please check your internet connection.");
        }

        return this.find('uploaded=no&error=no')
            .flatMap((data) => {
                let leads = data,
                    requests = [],
                    i = 0,
                    len = leads.length;
                console.log(data);
                for(; i< len; i++) {
                    requests.push(this.upload(leads[i]));
                }

                if(len === 0) {
                    return Observable.of([]);
                }

                console.log("About to upload..." + requests.length);
                return this.infoService.updateToken()
                    .flatMap(() => {                        
                        return Observable.forkJoin(requests);
                    });
            });
    }

    // Upload all records 
    uploadAll() {
        if (!window.navigator.onLine) {
            return Observable.throw("Please check your internet connection.");
        }

        return this.find('error=no')
            .flatMap((data) => {
                let leads = data,
                    requests = [],
                    i = 0,
                    len = leads.length;
                
                for(; i < len; i++) {
                    requests.push(this.upload(leads[i]));
                }

                if(len === 0) {
                    return Observable.of([]);
                }
                return this.infoService.updateToken()
                    .flatMap(() => {
                        return Observable.forkJoin(requests);
                    });
            });
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

    // Translate Pending Records
    translatePending() {
        if (!window.navigator.onLine) {
            return Observable.throw("Please check your internet connection.");
        }
        return this.find('translated=no&error=no')
            .flatMap((data) => {           
                let all = data,
                    leads = [],
                    i = 0,
                    len = all.length;
                for(; i < len; i++) {
                    if (!all[i].Translation.Keys) {
                        leads.push(this.translate(all[i]));
                    }
                }

                if(len === 0) {
                    return Observable.of([]);
                }

                return this.infoService.updateToken()
                    .flatMap(() => {
                        return Observable.forkJoin(leads);
                    });
            });
    }

    // Translate ALL records
    translateAll() {
        if (!window.navigator.onLine) {
            return Observable.throw("Please check your internet connection.");
        }
        return this.find('error=no')
            .flatMap((data) => {
                let all = data,
                    leads = [],
                    i = 0,
                    len = all.length;
                
                for(; i < len; i++) {
                    leads.push(this.translate(all[i]));
                }

                if (len === 0) {
                    return Observable.of([]);
                }

                return this.infoService.updateToken()
                    .flatMap(() => {
                        return Observable.forkJoin(leads);
                    });
            });
    }

    // Translate (if needed) and Upload
    translateAndUpload() {
        if (this.infoService.leadsource.HasTranslation) {
            return this.translatePending().flatMap((data) => {
                return this.uploadPending();
            });
        } else {
            return this.uploadPending();
        }
    }

    // Translate and re-upload ALL leads 
    translateAndUploadAll() {
        if (this.infoService.leadsource.HasTranslation) {
            return this.translateAll().flatMap((data) => {
                return this.uploadAll();
            });
        } else {
            return this.uploadAll();
        }
    }

    // Helper - search for duplicate tags, push new if not found
    searchForDupes(lead, tag, n) {
        if (lead.Responses.filter(k => k.Tag === tag).length > 0 ) {
            let dupes = false;
            let i = 0, j = lead.Responses.length;
            for (; i < j; i++) {
                if (lead.Responses[i].Tag === tag) {
                    if (!dupes) {
                        lead.Responses[i].Value = n.Value;
                        dupes = true;
                    } else {
                        lead.Responses.splice(i, 1);
                    }
                }
            }
        } else {
            lead.Responses.push(n);
        }
    }

    // Clear current background interval and start new
    initializeBackgroundUpload(mins) {
        clearInterval(this.backgroundInterval);
        if (mins === 0) {
            return false;
        }
        let time = mins * 60 * 1000;
        this.backgroundInterval = setInterval(() => {
            this.backgroundUpload();
        }, time);
    }

    // Upload in the background
    backgroundUpload() {
        if (!window.navigator.onLine) {
            return false;
        }
        this.translateAndUpload().subscribe((data) => {
            // Do nothing...
        }, (err) => {
            // Do nothing...
        });
    }
}