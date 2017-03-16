import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ScanCameraService {

    private camera = {
        visible : "YES",
        camera : "BACK",
        top: 62,
        left: 0,
        width: 320,
        height: 456  // With search bar, height = 404
    };
    public torch : string = "OFF";
    private endpoint : string = "http://localhost/barcodecontrol";

    constructor(private http: Http) {
    }

    turnOn() {
        this.http.post(this.endpoint, this.camera).map(res => res.json()).subscribe((data) => { });
    }

    turnOff() {  
        this.http.post(this.endpoint, { visible: "NO" }).map(res => res.json()).subscribe((data) => {});
    }

    toggleTorch() {
        this.torch = (this.torch === "OFF") ? "ON" : "OFF";
        this.http.post(this.endpoint, {torch: this.torch}).map(res => res.json()).subscribe((data) => {});
    }

    toggleCamera() {
        this.camera.camera = (this.camera.camera === "FRONT") ? "BACK" : "FRONT";
        this.http.post(this.endpoint, this.camera).map(res => res.json()).subscribe((data) => {});
    }
}