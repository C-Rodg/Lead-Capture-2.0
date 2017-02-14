import { Component, Input } from '@angular/core';

@Component({
    selector: 'text-input',
    template: `
    <ion-item class='{{ required === "true" ? "req" : ""}}'>
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