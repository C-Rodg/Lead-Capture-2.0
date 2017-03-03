import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { LeadSourceGuid } from '../helpers/leadSourceGuid';
import { InfoService } from './infoService';

@Injectable()
export class LoginService {

    constructor(private http: Http, private infoService: InfoService) {}

    private currentToken : {
        SessionToken : null
    };

    private loginArgs : {
        loginRestUrl :null,
        authCode : null,
        authGuid : null,
        hash: null
    };
 
    getAuthToken() {
        alert("GETTING AUTH TOKEN");
        return new Promise((resolve, reject) => {            
            this.http.get('http://localhost/leadsources/' + LeadSourceGuid.guid + '/sessiontoken').map((res) => res.json()).subscribe((data) => {
                if (data !== null) {
                    if ( data.Fault ) {
                        reject(data.Fault);
                    } else {
                        alert(JSON.stringify(data));
                        if (data.hasOwnProperty("SessionToken") && data.SessionToken !== null) {
                            this.currentToken.SessionToken = data.SessionToken;
                            alert(data.SessionToken);
                            return resolve(data.SessionToken);
                        } else {
                            alert("SHOULD BE UPDATING TOKEN");
                            return resolve(this.updateToken());
                        }
                    }
                } else {
                    reject("Invalid response object returned by the ajax call");
                }
            }, (error) => {
                reject(error);
            });
        });
    }

    getCurrentToken() {
        alert(this.currentToken.SessionToken);
        return this.currentToken.SessionToken;
    }

    updateToken() {
        let that = this;
        return new Promise((resolve, reject) => {
            this.initiateChallenge()
                .then((d) => {this.computeHash(d)})
                .then((d) => {this.validateChallenge(d)})
                .then((loginResult) => {
                    that.saveToken(loginResult['SessionToken'])
                        .then(() => resolve());
                })
                .catch((err) => reject(err));
        });
    }

    private initiateChallenge() {
        return new Promise((resolve, reject) => {
            let loginArgs = {
                loginRestUrl : this.infoService.leadsource.LoginUrl,
                authCode : this.infoService.leadsource.AuthCode,
                authGuid : this.infoService.leadsource.AuthGuid
            };
            alert(JSON.stringify(loginArgs));
            this.http.post(loginArgs.loginRestUrl + '/InitiateChallenge/' + loginArgs.authGuid, loginArgs).map((res) => res.json()).subscribe((data) => {
                loginArgs['challenge'] = data;
                alert(JSON.stringify(loginArgs));
                resolve(loginArgs);
            }, (error) => {
                alert(error);
                reject(error);
            });
        });
    }

    private computeHash(loginArgs) {    
        return new Promise((resolve, reject) => {
            let request = {
                authcode : loginArgs.authCode,
                nonce : loginArgs.challenge.Nonce
            };
            this.http.post('http://localhost/digestauthentication/computehash', request).map(res => res.json()).subscribe((data) => {
                loginArgs.hash = data.Hash;
                alert(JSON.stringify(loginArgs));
                resolve(loginArgs);
            }, (error) => {
                reject(error);
            });
        });
    }

    private validateChallenge(loginArgs) {
        return new Promise((resolve, reject) => {
            let urlHash = loginArgs.hash.replace(/\//g, "_");
            urlHash = urlHash.replace(/\+/g, "-");
            this.http.post(loginArgs.loginRestUrl + '/ValidateChallenge/' + loginArgs.challenge.ChallengeGuid + '/' + encodeURIComponent(urlHash), loginArgs).map(res => res.json()).subscribe((data) => {
                let loginResult = {
                    SessionToken : data.SessionToken
                };
                alert(JSON.stringify(loginResult));
                resolve(loginResult);
            }, (error) => {
                reject(error);
            });
        });
    }

    private saveToken(token) {
        return new Promise((resolve, reject) => {
            this.currentToken.SessionToken = token;
            this.http.put('http://localhost/leadsources/' + LeadSourceGuid.guid + '/sessiontoken', this.currentToken).map((res) => res.json()).subscribe((data) => {
                resolve(data);
            }, (error) => {
                reject(error);
            });
        });
    }
}