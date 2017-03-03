import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';

import { LeadSourceGuid } from '../helpers/leadSourceGuid';

@Injectable()
export class InfoService {

    public client : any = [];
    public leadsource : any = [];

    public currentToken : {
        SessionToken : null
    };

    constructor(private http: Http) {   
        
    }

    startUpApplication() {
        return this.getLeadClientInfo()
            .flatMap(() => this.getAuthToken())
            .flatMap((t) => {
                if (t) {
                    // Continue with seats shit..
                    alert("WE HAVE A TOKEN!");
                    alert(t);
                    return Observable.of(t);
                } else {
                    alert("UPDATING TOKEN");                    
                    return this.updateToken();
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
                    throw new Error(data.Fault);
                } else {                                                                
                    return data.SessionToken;
                }
            } else {   
                throw new Error("Invalid response object returned by ajax call");
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

    initiateChallenge() {
        let loginArgs = {
            loginRestUrl : this.leadsource.LoginUrl,
            authCode : this.leadsource.AuthCode,
            authGuid : this.leadsource.AuthGuid
        };
        return this.http.post(loginArgs.loginRestUrl + '/InitiateChallenge/' + loginArgs.authGuid, loginArgs).map((res) => res.json()).map((data) => {
            loginArgs['challenge'] = data;
            return loginArgs;
        });
    }

    computeHash(loginArgs) {
        let request = {
            authcode : loginArgs.authCode,
            nonce : loginArgs.challenge.Nonce
        };
        return this.http.post('http://localhost/digestauthentication/computehash', request).map(res => res.json()).map((data) => {
            loginArgs['hash'] = data.Hash;
            return loginArgs;
        });
    }

    validateChallenge(loginArgs) {
        let urlHash = loginArgs.hash.replace(/\//g, "_");
        urlHash = urlHash.replace(/\+/g, "-");
        return this.http.post(loginArgs.loginRestUrl + '/ValidateChallenge/' + loginArgs.challenge.ChallengeGuid + '/' + encodeURIComponent(urlHash), loginArgs).map(res => res.json()).map((data) => {
            return {
                SessionToken: data.SessionToken
            };
        });
    }

    saveToken(loginArgs) {
        alert("SAVING!");
        let that = this.currentToken;
        //let tokenObj = this.currentToken.SessionToken;
        //this.currentToken.SessionToken = loginArgs.SessionToken;
        let tokenObj = { SessionToken: loginArgs.SessionToken };
        return this.http.put('http://localhost/leadsources/' + LeadSourceGuid.guid + '/sessiontoken', tokenObj).map((res) => res.json());
    }
}