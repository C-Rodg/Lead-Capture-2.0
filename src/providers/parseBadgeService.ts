import { Injectable } from '@angular/core';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';

import { SettingsService } from './settingsService';
import { LeadsService } from './leadsService';
import { InfoService } from './infoService';
import { SoundService } from './soundService';

@Injectable()
export class ParseBadgeService {

    constructor(private settingsService : SettingsService,
        private leadsService : LeadsService,
        private infoService : InfoService,
        private soundService : SoundService
    ) { }

    // Begin parsing
    parse(d): Observable<any> {       

        let checkSymbology  = null,
            symbology       = null,
            scannerSource   = null,
            scannedData     = null,
            scannedId       = null;

        symbology = d[0].Symbology;
        scannerSource = d[0].Source;

        if ( scannerSource.indexOf('Camera') > -1 ) {
            scannedData = d[0].Data;
        } else {
            scannedData = decode_utf8(d[0].Data);
        }

        checkSymbology = symbology;
        if (checkSymbology != null) {
            checkSymbology = checkSymbology.replace(/\s+/g, '').toUpperCase();
        }

        if (checkSymbology === 'CODE3OF9' || checkSymbology === 'CODE39') {
            scannedId = scannedData;
        } else if (checkSymbology === 'QRCODE') {
            return this.parseQrCode(scannedData);
        } else if (checkSymbology === 'PDF417') {
            return this.parsePDF417(scannedData);
        } else if (checkSymbology === 'CODE128') {
            this.alertSymbologyScan(symbology, scannedData);
            return;
        } else if (checkSymbology === 'AZTEK') {
            this.alertSymbologyScan(symbology, scannedData);
            return;
        } else {
            this.alertSymbologyScan(symbology, scannedData);
            return;
        }
    }

    // Parse QR Codes
    parseQrCode(scannedData) {
        let scannedId        = scannedData,
            scannedFields    = null,
            type             = null,
            source           = null,
            badgeId          = null,
            badgeFirst       = null,
            badgeLast        = null,
            badgeCompany     = null;

        if (scannedData != null && scannedData.substring(0,4) === 'VQC:') {
            scannedData = scannedData.substring(4);
            scannedFields = scannedData.split(";");
            if(scannedFields != null) {
                scannedFields.forEach((fieldGroup) => {
                    let field = fieldGroup.split(":");
                    if (field != null && field.length > 0) {
                        if (field[0] === 'T') {
                            let typeCode = field[1];
                            if (typeCode === 'E') {
                                type = "EventHub QR Code";
                            } else if (typeCode === 'U') {
                                type = "EventHub QR Code Image URL";
                            } else if (typeCode === 'R') {
                                type = 'EventHub Quick Reg Code';                            
                            } else if (typeCode === 'P') {
                                type = 'PkPass via EventHub';
                            } else if (typeCode === 'B') {
                                type = 'Badge';
                            }
                        } else if (field[0] === 'S') {
                            source = field[1];
                        } else if (field[0] === 'ID') {
                            badgeId = field[1];
                        } else if (field[0] === 'FN') {
                            badgeFirst = field[1];
                        } else if (field[0] === 'LN') {
                            badgeLast = field[1];
                        } else if (field[0] === 'CO') {
                            badgeCompany = field[1];
                        }
                    }
                });             
            }
        } else if ( scannedData != null && (scannedData.match(/;/g) || []).length >= 2) { // For other QR codes, assuming badgeId is index 0, first name 1, lastname 2, company 3
            scannedFields = scannedData.split(';');

            if (scannedFields !== null) {
                badgeId = scannedFields[0];
                badgeFirst = scannedFields[1];
                badgeLast = scannedFields[2];
                if (scannedFields[3]) {
                    badgeCompany = scannedFields[3];
                }
            }
        } else {
            badgeId = scannedData;
            scannedId = scannedData;
        }

        scannedId = scannedId.replace(/^\s+|\s+$/g, "");
        if (scannedId !== '' && scannedId.length < 384) {
            this.soundService.playGranted();
            return this.leadsService.find(`ScanData=${scannedId}`).flatMap((data) => {
                if (data && data.length > 0) {

                    alert("FOUND AN EXISTING QR CODE LEAD");

                    let visit = {
                        ScanData: scannedId,
                        CapturedBy: this.settingsService.currentUser,
                        CaptureStation: this.settingsService.currentStation
                    };
                    
                    return this.leadsService.saveVisit(visit).flatMap(() => {
                        if (data[0].DeleteDateTime !== null) {
                            return this.leadsService.markUndeleted(data[0].LeadGuid);
                        } else {
                            return this.leadsService.markDeleted(data[0].LeadGuid).flatMap(() => {
                                return this.leadsService.markUndeleted(data[0].LeadGuid)
                            });
                        }
                    }).flatMap(() => {
                        return Observable.of(data[0]);
                    });
                } else {

                    alert("CREATING A NEW QR CODE LEAD");

                    let lead = {
                        ScanData: scannedId,
                        Keys: [{"Type":"7A56282B-4855-4585-B10B-E76B111EA1DB", "Value": badgeId}],
                        Responses: []
                    };

                    let resp = lead.Responses;
                    if (scannedData) {
                        resp.push({"Tag":"lcUnmapped", "Value": scannedData});
                    }
                    if (badgeId) {
                        resp.push({"Tag":"lcBadgeId", "Value": badgeId});
                    }
                    if (badgeFirst) {
                        resp.push({"Tag":"lcFirstName", "Value": badgeFirst});
                    }
                    if (badgeLast) {
                        resp.push({"Tag":"lcLastName", "Value": badgeLast});
                    }
                    if (badgeCompany) {
                        resp.push({"Tag":"lcCompany", "Value": badgeCompany});
                    }

                    // This is where you could handle default lead rank
                    // lead.Responses.push({"Tag":"lcLeadRank", "Picked": ['lcRankD']});
                    
                    lead.Keys.push({"Type":"F9F457FE-7E6B-406E-9946-5A23C50B4DF5", "Value": `${this.infoService.client.DeviceType}|${this.infoService.client.ClientName}`});
                    
                    return this.leadsService.saveNew(lead).flatMap((person) => {
                        lead["LeadGuid"] = person.LeadGuid;
                        let visit = {
                            ScanData: scannedId,
                            CapturedBy: this.settingsService.currentUser,
                            CaptureStation: this.settingsService.currentStation
                        };
                        return this.leadsService.saveVisit(visit);
                    }).flatMap(() => {
                        alert(JSON.stringify(lead));
                        return Observable.of(lead);
                    });
                }
            });
        }


    }


    // Parse custom PDF 417's
    parsePDF417(scannedData) {
        let scannedId        = scannedData,
            scannedFields    = null,
            type             = null,
            source           = null,
            badgeId          = null,
            badgeFirst       = null,
            badgeLast        = null,
            badgeCompany     = null,
            badgeTitle       = null,
            badgeAdd1        = null,
            badgeAdd2        = null,
            badgeAdd3        = null,
            badgeCity        = null,
            badgeState       = null,
            badgeZip         = null,
            badgePhone       = null,
            badgeFax         = null,
            badgeEmail       = null,
            fullCountry      = null,
            badgeCountry     = null;

        //scannedFields = scannedData.split('\t');
        scannedFields = scannedData.split(';');

        scannedId       = scannedFields[0].trim();
        badgeId         = scannedId;
        badgeFirst      = scannedFields[2].trim();
        badgeLast       = scannedFields[4].trim();
        badgeCompany    = scannedFields[6].trim();
        badgeTitle      = scannedFields[28].trim();
        badgeAdd1       = scannedFields[8].trim();
        badgeAdd2       = scannedFields[10].trim();
        badgeAdd3       = scannedFields[12].trim();
        badgeCity       = scannedFields[14].trim();
        badgeState      = scannedFields[16].trim();
        badgeZip        = scannedFields[18].trim();
        badgePhone      = scannedFields[22].trim().replace(/[^\d]/g, '');
        badgeFax        = scannedFields[24].trim().replace(/[^\d]/g, '');
        badgeEmail      = scannedFields[26].trim();
        fullCountry     = scannedFields[20];

        if (fullCountry !== null && fullCountry.length > 0) {
            badgeCountry = fullCountry;
            fullCountry = fullCountry.trim().toUpperCase();
            if (fullCountry.length === 2) {
                let i = 0,
                    len = gCountryCodes.length;
                for (i; i < len; i++) {
                    if (fullCountry === gCountryCodes[i]) {
                        badgeCountry = gCountries[i];
                        break;
                    }
                }
            }
        }

        scannedId = scannedId.replace(/^\s+|\s+$/g, "");
        if (scannedId && scannedId.length < 384) {
            this.soundService.playGranted();

            return this.leadsService.find(`ScanData=${scannedId}`).flatMap((data) => {
                if (data && data.length > 0) {
                    alert("FOUND AN EXISTING PDF417 lead");

                    let visit = {
                        ScanData: scannedId,
                        CapturedBy : this.settingsService.currentUser,
                        CaptureStation: this.settingsService.currentStation
                    };

                    return this.leadsService.saveVisit(visit).flatMap(() => {
                        if (data[0].DeleteDateTime !== null) {
                            return this.leadsService.markUndeleted(data[0].LeadGuid);
                        } else {
                            return this.leadsService.markDeleted(data[0].LeadGuid).flatMap(() => {
                                return this.leadsService.markUndeleted(data[0].LeadGuid);
                            });
                        }
                    });
                } else {
                    alert("CREATING A NEW PDF417 LEAD");
                    let lead = {
                        ScanData: scannedId,
                        Keys: [{"Type":"7A56282B-4855-4585-B10B-E76B111EA1DB", "Value": badgeId}],
                        Responses: []
                    };

                    let resp = lead.Responses;
                    if (scannedData) {
                        resp.push({"Tag":"lcUnmapped", "Value": scannedData});
                    }
                    if (badgeId) {
                        resp.push({"Tag":"lcBadgeId", "Value": badgeId});
                    }
                    if (badgeFirst) {
                        resp.push({"Tag":"lcFirstName", "Value": badgeFirst});
                    }
                    if (badgeLast) {
                        resp.push({"Tag":"lcLastName", "Value": badgeLast});
                    }
                    if (badgeCompany) {
                        resp.push({"Tag":"lcCompany", "Value": badgeCompany});
                    }
                    if (badgeTitle) {
                        resp.push({"Tag":"lcTitle", "Value": badgeTitle});
                    }
                    if (badgeAdd1) {
                        resp.push({"Tag":"lcAddress1", "Value": badgeAdd1});
                    }
                    if (badgeAdd2) {
                        resp.push({"Tag":"lcAddress2", "Value": badgeAdd2});
                    }
                    if (badgeAdd3) {
                        resp.push({"Tag":"lcAddress3", "Value": badgeAdd3});
                    }
                    if (badgeCity) {
                        resp.push({"Tag":"lcCity", "Value": badgeCity});
                    }
                    if (badgeState) {
                        resp.push({"Tag":"lcState", "Value": badgeState});
                    }
                    if (badgeZip) {
                        resp.push({"Tag":"lcZip", "Value": badgeZip});
                    }
                    if (badgeCountry) {
                        resp.push({"Tag":"lcCountry", "Value": badgeCountry});
                    }
                    if (badgeEmail) {
                        resp.push({"Tag":"lcEmail", "Value": badgeEmail});
                    }
                    if (badgePhone) {
                        resp.push({"Tag":"lcPhone", "Value": badgePhone});
                    }
                    if (badgeFax) {
                        resp.push({"Tag":"lcFax", "Value": badgeFax});
                    }

                    // This is where you could handle default lead rank
                    // resp.push({"Tag":"lcLeadRank", "Picked": ['lcRankD']});

                    lead.Keys.push({"Type":"F9F457FE-7E6B-406E-9946-5A23C50B4DF5", "Value": `${this.infoService.client.DeviceType}|${this.infoService.client.ClientName}`});

                    return this.leadsService.saveNew(lead).flatMap((person) => {
                        lead["LeadGuid"] = person.LeadGuid;
                        let visit = {
                            ScanData: scannedId,
                            CapturedBy: this.settingsService.currentUser,
                            CaptureStation: this.settingsService.currentStation
                        };
                        return this.leadsService.saveVisit(visit);
                    }).flatMap(() => {
                        return Observable.of(lead);
                    });
                }
            });
        }
    }

    // Alert symbology, show scan data
    alertSymbologyScan(sym, d) {
        this.soundService.playDenied();
        alert('This app was not written to support ' + sym + ' symbology. \n\nScanned Data: ' + d);
        throw new Error('Symbology not supported');
    }
}

function decode_utf8(s) {
    return decodeURIComponent((<any>window).escape(s));
}

const gCountries = ["United States","Canada","Afghanistan","Aland Islands","Albania","Algeria","American Samoa","Andorra","Angola","Anguilla","Antarctica","Antigua And Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia And Herzegovina","Botswana","Bouvet Island","Brazil","British Indian Ocean Territory","Brunei Darussalam","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Central African Republic","Chad","Chile","China","Christmas Island","Cocos (Keeling) Islands","Colombia","Comoros","Congo","Congo, The Democratic Republic Of The","Cook Islands","Costa Rica","Cote D'Ivoire","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands (Malvinas)","Faroe Islands","Fiji","Finland","France","French Guiana","French Polynesia","French Southern Territories","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guadeloupe","Guam","Guatemala","Guernsey","Guinea","Guinea-Bissau","Guyana","Haiti","Heard Island And Mcdonald Islands","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran, Islamic Republic Of","Iraq","Ireland","Isle Of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Korea, Democratic People's Republic of","Korea, Republic of","Kuwait","Kyrgyzstan","Lao People'S Democratic Republic","Latvia","Lebanon","Lesotho","Liberia","Libyan Arab Jamahiriya","Liechtenstein","Lithuania","Luxembourg","Macao","Macedonia, The Former Yugoslav Republic Of","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Martinique","Mauritania","Mauritius","Mayotte","Mexico","Micronesia, Federated States Of","Moldova, Republic Of","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Niue","Norfolk Island","Northern Mariana Islands","Norway","Oman","Pakistan","Palau","Palestinian Territory, Occupied","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Pitcairn","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russian Federation","Rwanda","Saint Barthélemy","Saint Helena","Saint Kitts And Nevis","Saint Lucia","Saint Martin","Saint Pierre And Miquelon","Saint Vincent And The Grenadines","Samoa","San Marino","Sao Tome And Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Georgia And The South Sandwich Islands","Spain","Sri Lanka","Sudan","Suriname","Svalbard And Jan Mayen","Swaziland","Sweden","Switzerland","Syrian Arab Republic","Taiwan, Province Of China","Tajikistan","Tanzania, United Republic Of","Thailand","Timor-Leste","Togo","Tokelau","Tonga","Trinidad And Tobago","Tunisia","Turkey","Turkmenistan","Turks And Caicos Islands","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States Minor Outlying Islands","Uruguay","Uzbekistan","Vanuatu","Vatican City State","Venezuela","Viet Nam","Virgin Islands, British","Virgin Islands, U.S.","Wallis And Futuna","Western Sahara","Yemen","Zambia","Zimbabwe"];

const gCountryCodes = ['US','CA','AF','AX','AL','DZ','AS','AD','AO','AI','AQ','AG','AR','AM','AW','AU','AT','AZ','BS','BH','BD','BB','BY','BE','BZ','BJ','BM','BT','BO','BA','BW','BV','BR','IO','BN','BG','BF','BI','KH','CM','CV','KY','CF','TD','CL','CN','CX','CC','CO','KM','CG','CD','CK','CR','CI','HR','CU','CY','CZ','DK','DJ','DM','DO','EC','EG','SV','GQ','ER','EE','ET','FK','FO','FJ','FI','FR','GF','PF','TF','GA','GM','GE','DE','GH','GI','GR','GL','GD','GP','GU','GT','GG','GN','GW','GY','HT','HM','HN','HK','HU','IS','IN','ID','IR','IQ','IE','IM','IL','IT','JM','JP','JE','JO','KZ','KE','KI','KP','KR','KW','KG','LA','LV','LB','LS','LR','LY','LI','LT','LU','MO','MK','MG','MW','MY','MV','ML','MT','MH','MQ','MR','MU','YT','MX','FM','MD','MC','MN','ME','MS','MA','MZ','MM','NA','NR','NP','NL','AN','NC','NZ','NI','NE','NG','NU','NF','MP','NO','OM','PK','PW','PS','PA','PG','PY','PE','PH','PN','PL','PT','PR','QA','RE','RO','RU','RW','BL','SH','KN','LC','MF','PM','VC','WS','SM','ST','SA','SN','RS','SC','SL','SG','SK','SI','SB','SO','ZA','GS','ES','LK','SD','SR','SJ','SZ','SE','CH','SY','TW','TJ','TZ','TH','TL','TG','TK','TO','TT','TN','TR','TM','TC','TV','UG','UA','AE','GB','UM','UY','UZ','VU','VA','VE','VN','VG','VI','WF','EH','YE','ZM','ZW'];
