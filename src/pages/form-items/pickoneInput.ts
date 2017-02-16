import { Component, Input } from '@angular/core';

@Component({
    selector: 'pickone-input',
    template: `
    <ion-item [ngClass]="{'req' : (required == 'true')}">
        <ion-label>{{prompt}}</ion-label>
        <ion-select (ionChange)="testFunc($event)">
            <ion-option  *ngFor="let option of pickOptions"
            value={{option.tag}}
            >
            {{option.prompt}}
            </ion-option>
        </ion-select>
    </ion-item>
    `
})
export class PickoneInput {
    @Input() prompt:string;
    @Input() required: string;
    @Input() pickOptions: any;

    @Input() formControlName : any;

    val : any;

    constructor() {
        console.log(this.formControlName);
    }


    testFunc(d) {
        console.log(d);
        console.log(this);
    }
}




//<div>{{prompt}}<select><option *ngFor="let option of pickOptions" value={{option.tag}}>{{option.prompt}}</option></select></div>