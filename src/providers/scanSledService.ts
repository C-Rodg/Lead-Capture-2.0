import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ScanSledService {
    private endpoint : string = "http://localhost/linea/";
    
    constructor(private http: Http) {

    }

    sendScanCommand(cmd) {
        this.http.get(this.endpoint + cmd).map((res) => res.json()).subscribe((data) => {});
    }
}