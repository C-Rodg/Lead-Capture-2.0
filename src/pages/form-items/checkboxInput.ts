import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const noop = () => {};

export const CUSTOM_CHECKBOX_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxInput),
    multi: true
};

@Component({
    selector: 'checkbox-input',
    providers: [CUSTOM_CHECKBOX_CONTROL_VALUE_ACCESSOR],
    template: `    
    <ion-item [ngClass]="{'req' : (required == 'true')}">
         <ion-label>{{prompt}}</ion-label>
         <ion-checkbox color="p-primary-dark" (ionChange)="selectItem($event)" [(ngModel)]="innerValue"></ion-checkbox>
    </ion-item>
    `
})
export class CheckboxInput implements ControlValueAccessor {
    @Input() prompt:string;
    @Input() required: string;
    private innerValue : any = false;
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_:any) => void = noop;

    selectItem(ev) {
        if(ev.checked !== this.innerValue) {
            this.innerValue = ev.checked;
            this.onChangeCallback(ev.checked);
            this.onTouchedCallback();
        }
    }

    // Methods that extend ControlValueAccessor
    writeValue(value: any) {
        if (value !== this.innerValue) {
            this.innerValue = value;
        }        
    }

    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }
}