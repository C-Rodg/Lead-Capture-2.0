import { Component, Input } from '@angular/core';

@Component({
    selector: 'text-area',
    template: `
    <ion-item [ngClass]="{'req' : (required == 'true')}">
        <ion-label stacked>{{prompt}}</ion-label>
        <ion-textarea type="text" ></ion-textarea>
    </ion-item>
    `
})
export class TextArea {
    @Input() prompt:string;
    @Input() required: string;
}
