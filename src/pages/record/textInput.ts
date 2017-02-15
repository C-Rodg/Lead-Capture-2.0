import { Component, Input } from '@angular/core';
//import {IONIC_DIRECTIVES} from 'ionic-angular';

@Component({
    selector: 'text-input',
    // directives: [],
    template: `
    <ion-item [ngClass]="{'req' : (required == 'true')}">
        <ion-label stacked>{{prompt}}</ion-label>
        <ion-input type="text" ></ion-input>
    </ion-item>
    `
})
export class TextInput {
    @Input() tag:string;
    @Input() prompt:string;
    @Input() required: boolean;
}