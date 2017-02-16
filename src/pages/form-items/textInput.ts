import { Component, Input } from '@angular/core';

@Component({
    selector: 'text-input',
    template: `
    <ion-item [ngClass]="{'req' : (required == 'true')}">
        <ion-label stacked>{{prompt}}</ion-label>
        <ion-input type="text" ></ion-input>
    </ion-item>
    `
})
export class TextInput {
    @Input() prompt:string;
    @Input() required: string;
}