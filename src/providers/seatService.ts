import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { LeadSourceGuid } from '../helpers/leadSourceGuid';
import { InfoService } from './infoService';
import { LoginService } from './loginService';

@Injectable()
export class SeatService {

    private seat = null;

    constructor(private http: Http, private infoService: InfoService, private loginService: LoginService) {
        
    }

    getSeat() {
        return new Promise((resolve, reject) => {
            this.http.get('http://localhost/leadsources/' + LeadSourceGuid.guid + '/seat').map(res => res.json()).subscribe((data) => {
                this.seat = data;
                resolve(data);
            }, (error) => {
                reject("error getting seat");
            });
        });
    }

    setSeat(seat) {
        return new Promise((resolve, reject) => {
            this.http.put('http://localhost/leadsources/' + LeadSourceGuid.guid + '/seat', seat).map(res => res.json()).subscribe((data) => {
                // says to set 'seat' to infoService.SeatGuid ???
                this.seat = data;
                resolve(data);
            }, (error) => {
                this.seat = null;
                reject("error setting seat");
            });
        });
    }

    acquireSeat() {
        return new Promise((resolve, reject) => {
            let url = this.infoService.leadsource.LeadSourceUrl + '/AcquireSeat/' + LeadSourceGuid.guid;
            let obj = {
                clientGuid : this.infoService.client.ClientGuid,
                application : this.infoService.client.Application + " " + this.infoService.client.ApplicationVersion,
                operatingSystem : this.infoService.client.SystemName + " " + this.infoService.client.SystemVersion,
                description : this.infoService.client.DeviceType + ":  " + this.infoService.client.ClientName
            };
            let headers = new Headers();
            headers.append('Authorization', 'ValidarSession token="' + this.loginService.getCurrentToken() + '"');            
            this.http.post(url, obj, {headers: headers}).map(res => res.json()).subscribe((data) => {
                if (data.Fault) {
                    reject(data.Fault);
                } else {
                    resolve(data.SeatGuid);
                }
            }, (error) => {
                if (error && error.Fault.Type) {
                    if (error.Fault.Type === 'InvalidSessionFault') {
                        this.loginService.updateToken().then(() => this.acquireSeat());
                    } else {
                        reject("ConnectionTimeout");
                    }
                }
            });
        });
    }

    releaseSeat(e) {
        return new Promise((resolve, reject) => {
            if (this.seat) {
                let url = this.infoService.leadsource.LeadSourceUrl + '/ReleaseSeat/' + LeadSourceGuid.guid + "/" + this.seat;
                let obj = {
                    leadSourceGuid : LeadSourceGuid.guid
                };
                let headers = new Headers();
                headers.append('Authorization', 'ValidarSession token="' + this.loginService.getCurrentToken() + '"');
                this.http.post(url, obj, {headers: headers}).map(res => res.json()).subscribe((data) => {
                    if (data.Fault) {
                        reject(data.Fault);
                    } else {
                        this.setSeat(data).then(() => {
                            resolve(data.SeatGuid);
                        });
                    }
                }, (error) => {
                    reject("ConnectionTimeout");
                });
            } else {
                reject("No local seat available to release.");
            }
        });
    }
}