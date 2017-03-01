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
        return new Promise((resolve, reject) => {
            this.http.get('http://localhost/leadsources' + LeadSourceGuid.guid + '/sessiontoken').map((res) => res.json()).subscribe((data) => {
                if (data !== null) {
                    if ( data.Fault ) {
                        reject(data.Fault);
                    } else {
                        if (data.hasOwnProperty("SessionToken") && data.SessionToken !== null) {
                            this.currentToken.SessionToken = data.SessionToken;
                            resolve(data.SessionToken);
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
        return new Promise((resolve, reject) => {
            this.initiateChallenge()
                .then(this.computeHash)
                .then(this.validateChallenge)
                .then((loginResult) => {
                    this.saveToken(loginResult['SessionToken'])
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
            this.http.post(loginArgs.loginRestUrl + '/InitiateChallenge/' + loginArgs.authGuid, loginArgs).map((res) => res.json()).subscribe((data) => {
                loginArgs['challenge'] = data;
                resolve(loginArgs);
            }, (error) => {
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