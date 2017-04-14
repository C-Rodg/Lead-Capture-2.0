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
    private cameraOn: boolean = false;

    constructor(private http: Http) {
        this.calculatePosition = this.calculatePosition.bind(this);
        this.calculatePosition();
        window.addEventListener('orientationchange', () => {
            setTimeout(this.calculatePosition, 700);
        }, false);
    }

    calculatePosition() {
        const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        if (width < 420) {
            // iTouch portrait mode
            this.camera.width = width;
            this.camera.height = 456;
            if (this.cameraOn) {
                this.turnOn();
            }
        } else if (width < 600) {
            // iTouch in landscape mode
            this.camera.width = width;
            this.camera.height = height - 115;
            if (this.cameraOn) {
                this.turnOn();
            }
        } else if (width < 800) {
            // This is iPad in portrait mode
            this.camera.width = width;
            this.camera.height = height - 123;
            if (this.cameraOn) {
                this.turnOn();
            }
        } else {
            // This is iPad in landscape mode or bigger...
            this.camera.width = width;
            this.camera.height = height - 123;
            if (this.cameraOn) {
                this.turnOn();
            }
        }
    }

    turnOn() {
        this.cameraOn = true;
        this.http.post(this.endpoint, this.camera).map(res => res.json()).subscribe((data) => { });
    }

    turnOff() {  
        this.cameraOn = false;
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