import { Injectable } from '@angular/core';

import { LeadSourceGuid } from '../helpers/leadSourceGuid';

@Injectable()
export class SettingsService {

    backgroundUploadWait : Number = 3;
    quickScanMode : boolean = false;
    showDeleted : boolean = false;
    currentUser : string = "Booth Staff";
    users : Array<string> = ["Booth Staff"];
    currentStation : string = "Booth";
    stations: Array<string> = ["Booth", "Meeting", "Session", "Other"];

    constructor() {
        let settings = this.loadStoredSettings();
        if (settings) {
            this.assignSettings(settings);
        }
    }

    // Set Primitive setting value
    setValue(val, prop) {
        this[prop] = val;
        this.storeCurrentSettings();
    }

    // Push array settings value
    pushArraySetting(val, arrName) {
        this[arrName].push(val);
        this.storeCurrentSettings();
    }

    // Delete array settings value
    deleteArraySetting(idx, arrName) {
        this[arrName].splice(idx, 1);
        this.storeCurrentSettings();
    }

    // Set array settings value
    setArraySetting(val, idx, arrName) {
        this[arrName][idx] = val;
        this.storeCurrentSettings();
    }

    // Store current settings to local storage
    storeCurrentSettings() {
        let settings = {
            backgroundUploadWait: this.backgroundUploadWait,
            quickScanMode: this.quickScanMode,
            showDeleted: this.showDeleted,
            currentUser: this.currentUser,
            users: this.users,
            currentStation: this.currentStation,
            stations : this.stations
        };
        let settingsStr = JSON.stringify(settings);
        window.localStorage.setItem(LeadSourceGuid.guid, settingsStr);
    }

    // Load stored settings from local storage
    loadStoredSettings() {
        let settingsStr = window.localStorage.getItem(LeadSourceGuid.guid);
        try {
            return JSON.parse(settingsStr);
        } catch (e) {
            return null;
        }
    }

    assignSettings(settings) {
        for (let prop in settings) {
            if (settings.hasOwnProperty(prop) && this.hasOwnProperty(prop)) {
                this[prop] = settings[prop];
            }
        }
    }

}