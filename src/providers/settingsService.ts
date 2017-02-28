import { Injectable } from '@angular/core';

@Injectable()
export class SettingsService {

    backgroundUpload : boolean = true;  // NEEDED?
    backgroundUploadWait : Number = 3;
    quickScanMode : boolean = false;
    showDeleted : boolean = false;
    currentUser : string = "Booth Staff";
    users : Array<string> = ["Booth Staff"];
    currentStation : string = "Booth";
    stations: Array<string> = ["Booth", "Meeting", "Session", "Other"];


    constructor() {  }

    // Set Primitive setting value
    setValue(val, prop) {
        this[prop] = val;
    }

    // Push array settings value
    pushArraySetting(val, arrName) {
        this[arrName].push(val);
    }

    // Delete array settings value
    deleteArraySetting(idx, arrName) {
        this[arrName].splice(idx, 1);
    }

    // Set array settings value
    setArraySetting(val, idx, arrName) {
        this[arrName][idx] = val;
    }

}