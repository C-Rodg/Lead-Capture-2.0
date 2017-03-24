import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

import { LeadSourceGuid } from '../helpers/leadSourceGuid';

interface LoginArgument {
    loginRestUrl? : string;
    authCode? : string;
    authGuid? : string;
    challenge? : string;
    hash? : string;
}

interface CurrentTokenObject {
    SessionToken? : string;
}

interface AcquireSeatObject {
    clientGuid? : string;
    application? : string;
    operatingSystem? : string;
    description? : string;
}

interface ReleaseSeatObject {
    leadSourceGuid? : string;
}

@Injectable()
export class InfoService {

    // Device Info
    client : any = [];
    leadsource : any = [];

    // Session Token
    currentToken : CurrentTokenObject = {
        SessionToken : null
    };

    // Seats
    seat : string = null;

    constructor(private http: Http) {   
        
    }

    ////////////////////////////////
    //  BOOT APPLICATION
    ////////////////////////////////

    startUpApplication() {
        return this.getLeadClientInfo()
            .flatMap(() => this.getAuthToken())
            .flatMap((t) => {
                if (t) {
                    this.currentToken.SessionToken = t;
                    return Observable.of(t);
                } else {              
                    return this.updateToken();
                }
            })
            .flatMap(() => this.getSeat())
            .flatMap((s) => {
                if (s && s.SeatGuid) {
                    return Observable.of(s);
                } else {
                    return this.acquireSeat()
                        .flatMap((theSeat) => this.setSeat(theSeat));
                }
            });
    }

    ////////////////////////////////
    //  GETTING DEVICE INFO
    ////////////////////////////////

    getLeadClientInfo() {
        let clientXHR = this.getClientInfo();
        let lsXHR = this.getLeadSources();
        return Observable.forkJoin([clientXHR, lsXHR]);
    }    

    getClientInfo() {
        return this.http.get('http://localhost/clientinfo').map(res => res.json()).map((res) => {
            this.client = res;
            return res;
        });
    }

    getLeadSources() {
        return this.http.get('http://localhost/leadsources/' + LeadSourceGuid.guid).map(res => res.json()).map((res) => {
            this.leadsource = res.LeadSource;        
            return res.LeadSource;
        });
    }

    ////////////////////////////////////////
    // HANDLE LOGGING IN AND ACQUIRING TOKEN
    ////////////////////////////////////////

    getAuthToken() {        
        return this.http.get('http://localhost/leadsources/' + LeadSourceGuid.guid + '/sessiontoken').map((res) => res.json()).map((data) => {
            if (data !== null) {
                if (data.Fault) {
                    Observable.throw(data.Fault);
                } else {                                                                
                    return data.SessionToken;
                }
            } else {   
                Observable.throw("Invalid response object returned by ajax call");
            }
        });
    }

    getCurrentToken() {
        return this.currentToken.SessionToken;
    }

    updateToken() {
        return this.initiateChallenge()
            .flatMap((data) => this.computeHash(data))
            .flatMap((data) => this.validateChallenge(data))
            .flatMap((data) => this.saveToken(data));
    }

    private initiateChallenge() {
        let loginArgs : LoginArgument = {
            loginRestUrl : this.leadsource.LoginUrl,
            authCode : this.leadsource.AuthCode,
            authGuid : this.leadsource.AuthGuid
        };
        return this.http.post(loginArgs.loginRestUrl + '/InitiateChallenge/' + loginArgs.authGuid, loginArgs).map((res) => res.json()).map((data) => {
            loginArgs['challenge'] = data;
            return loginArgs;
        });
    }

    private computeHash(loginArgs) {
        let request = {
            authcode : loginArgs.authCode,
            nonce : loginArgs.challenge.Nonce
        };
        return this.http.post('http://localhost/digestauthentication/computehash', request).map(res => res.json()).map((data) => {
            loginArgs['hash'] = data.Hash;
            return loginArgs;
        });
    }

    private validateChallenge(loginArgs) {
        let urlHash = loginArgs.hash.replace(/\//g, "_");
        urlHash = urlHash.replace(/\+/g, "-");
        return this.http.post(loginArgs.loginRestUrl + '/ValidateChallenge/' + loginArgs.challenge.ChallengeGuid + '/' + encodeURIComponent(urlHash), loginArgs).map(res => res.json()).map((data) => {
            return {
                SessionToken: data.SessionToken
            };
        });
    }

    private saveToken(loginArgs) {
        this.currentToken.SessionToken = loginArgs.SessionToken;
        return this.http.put('http://localhost/leadsources/' + LeadSourceGuid.guid + '/sessiontoken', this.currentToken).map((res) => res.json());
    }

    ////////////////////////////
    // HANDLE SEAT SERVICES 
    ////////////////////////////

    getSeat() {
        return this.http.get('http://localhost/leadsources/' + LeadSourceGuid.guid + '/seat').map(res => res.json()).map((data) => {
            if (data && data.SeatGuid) {
                this.seat = data.SeatGuid;
            }
            return data;
        });
    }

    setSeat(seat) {
        return this.http.put('http://localhost/leadsources/' + LeadSourceGuid.guid + '/seat', seat).map(res => res.json());
    }

    acquireSeat() {
        let url = `${this.leadsource.LeadSourceUrl}/AcquireSeat/${LeadSourceGuid.guid}`;
        let obj : AcquireSeatObject = {
            clientGuid : this.client.ClientGuid,
            application : `${this.client.Application} ${this.client.ApplicationVersion}`,
            operatingSystem : `${this.client.SystemName} ${this.client.SystemVersion}`,
            description : `${this.client.DeviceType}:  ${this.client.ClientName}` 
        };
        let headers = new Headers();
        headers.append('Authorization', `ValidarSession token="${this.getCurrentToken()}"`);
        return this.http.post(url, obj, { headers } ).map(res => res.json()).map((data) => {
            if (data && data.SeatGuid) {
                this.seat = data.SeatGuid;
            }
            return data;
        });
    }

    releaseSeat() {
        if (this.seat) {
            let url = `${this.leadsource.LeadSourceUrl}/ReleaseSeat/${LeadSourceGuid.guid}/${this.seat}`;
            let obj : ReleaseSeatObject =  {
                leadSourceGuid: LeadSourceGuid.guid
            };
            let headers = new Headers();
            headers.append('Authorization', `ValidarSession token="${this.getCurrentToken()}"`);
            return this.http.post(url, obj, { headers }).map(res => res.json());
        } else {
            Observable.throw("No local seat available to release");
        }
    }

    ////////////////////////////////
    //  GET HELPERS
    ////////////////////////////////

    getApplicationInformation() : string {
        let c = this.client;
        return `vCapture Pro version ${c.ApplicationVersion}`;        
    }

    getDeviceInformation() : string {
        let c = this.client;
        return `${c.DeviceType} running ${c.SystemName} ${c.SystemVersion}`;    
    }

    getCameraStatus(camera) : boolean {
        return this.client[camera];
    }

    getLineaStatus() : boolean {
        return (!this.client.Scanner || this.client.Scanner === "None") ? false : true;
    }

    getExhibitorName() : string {
        return (this.leadsource.ExhibitorName) ? this.leadsource.ExhibitorName : "Validar Lead Capture"
    }
}