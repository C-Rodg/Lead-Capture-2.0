import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Device } from '../device/device';

// TEMPORARY FOR TESTING
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-scan-sled',
  templateUrl: 'scan-sled.html'
})
export class ScanSled {

  constructor(public navCtrl: NavController, public http: Http) {
    (<any>window).OnDataRead = this.handleDataRead;
  }

  ionViewDidEnter() {
    this.http.get(`http://localhost/linea/enableButtonScan`).map((res) => res.json()).subscribe((data) => console.log(data));
  }

  ionViewDidLeave() {
    // Should I set window.OnDataRead to null??

    this.http.get(`http://localhost/linea/disableButtonScan`).map((res) => res.json()).subscribe((data) => console.log(data));
  }

  editUserPage() {
    this.navCtrl.push(Device);
  }

  searchByBadgeId(event) {
    alert("Searching for " + event.target.value);
  }

  scanBtnClicked(event, status) {
    if (status) {
      event.currentTarget.classList.add('scan-clicked');
      this.lineaScanCmd('startScan');
    } else {
      event.currentTarget.classList.remove('scan-clicked');
      this.lineaScanCmd('stopScan');
    }
  }

  lineaScanCmd(cmd) {
    this.http.get(`http://localhost/linea/${cmd}`).map((res) => res.json()).subscribe((data) => console.log(data));
  }

  handleDataRead(d) {
    alert(JSON.stringify(d));

    let scannedData = null,
        scannedId = null,
        symbology = null,
        scannedFields = null,
        scannerSource = null,
        badgeId = null,
        badgeFirst = null,
        badgeLast = null,
        badgeComp = null,
        badgeTitle = null,
        badgeAdd1 = null,
        badgeAdd2 = null,
        badgeAdd3 = null,
        badgeCity = null,
        badgeState = null,
        badgeZip = null,
        badgeCountry = null,
        badgeEmail = null,
        badgePhone = null,
        badgeFax = null;

    // Not sure about these...
    let type = null,
        source = null;


    symbology = d[0].Symbology;
    scannerSource = d[0].Source;

    if (d[0].Source.indexOf('Camera') > -1) {
      scannedData = d[0].Data;
    } else {
      // TODO: send sled scans to decode function
      //scannedData = decodeURIComponent(escape(d[0].Data));
      // TESTING:
      scannedData = d[0].Data;
    }

    let checkSymbology = symbology;
    if (checkSymbology) {
      checkSymbology = checkSymbology.replace(/\s+/g, "").toUpperCase();
    }

    if (checkSymbology === "CODE3OF9" || checkSymbology === "CODE39") {
      scannedId = scannedData;
      alert(scannedId);
    } else if (checkSymbology === "CODE128") {  // Ignore Code 128 scans because partial contact in QR code will be more useful
      // TODO: PLAY DENIED NOISE AND RETURN
      alert("CODE 128! DENY!");
      return false;
    } else if (checkSymbology === "AZTEK") {
      alert(`This app was not written to support barcode symbology: ${symbology}.\n\nHowever the scanned data was: ${scannedData}`);
      // TODO: PLAY DENIED NOISE AND RETURN
      return false;
    } else if (checkSymbology === "QRCODE") {
      scannedId = scannedData;

      // Decode VALIDAR Qr Code
      if (scannedData != null && scannedData.substring(0,4) === "VQC:") {
        scannedData = scannedData.substring(4);
        scannedFields = scannedData.split(";");
        if (scannedFields != null) {
          for(let i = 0, len = scannedFields.length; i < len; i++) {
            let field = scannedFields[i].split(":");
            if (field != null && field.length > 0) {
              if (field[0] === "T") {
                let typeCode = field[1];
                if (typeCode === "E") {
                  type = "EventHub QR Code";
                } else if (typeCode === "U") {
                  type = "EventHub QR Code Image URL";
                } else if (typeCode === "R") {
                  type = "EventHub Quick Reg Code";
                } else if (typeCode === "P") {
                  type = "PkPass via EventHub";
                } else if (typeCode === "B") {
                  type = "Badge";
                }
              } else if (field[0] === "S") {
                source = field[1];
              } else if (field[0] === "ID") {
                badgeId = field[1];
              } else if (field[0] === "FN") {
                badgeFirst = field[1];
              } else if (field[0] === "LN") {
                badgeLast = field[1];
              } else if (field[0] === "CO") {
                badgeComp = field[1];
              }
            }
          }
        }
      } else {
        badgeId = scannedData;
        scannedId = scannedData;
      }
    } else if (checkSymbology === "PDF417") {
      // TODO: Parse PDF417!!!!
    }


  }



}