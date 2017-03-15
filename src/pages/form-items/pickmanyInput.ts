import { Component, Input, forwardRef, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Select } from 'ionic-angular';

const noop = () => {};

export const CUSTOM_PICKMANY_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PickmanyInput),
    multi: true
};

@Component({
    selector: 'pickmany-input',
    providers: [CUSTOM_PICKMANY_CONTROL_VALUE_ACCESSOR],
    template: `
    <ion-item [ngClass]="{'req' : (required == 'true')}">
        <ion-label>{{prompt}}</ion-label>
        <ion-select (ionChange)="selectItem($event)" (click)="selectOpened()" multiple="true">
            <ion-option  *ngFor="let option of pickOptions"
            value={{option.tag}}
            >
            {{option.prompt}}
            </ion-option>
        </ion-select>
    </ion-item>
    `
})
export class PickmanyInput implements ControlValueAccessor {
    @Input() prompt:string;
    @Input() required: string;
    @Input() pickOptions: any;
    private innerValue : any ="";
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_:any) => void = noop;

    @ViewChild(Select) selectComp;

    selectItem(ev) {
        if(ev !== this.innerValue) {
            this.innerValue = ev;
            this.onChangeCallback(ev);
        }
    }

    selectOpened() {
        this.onTouchedCallback();
    }

    // Methods that extend ControlValueAccessor
    writeValue(value: any) {
        if (value !== this.innerValue) {
            this.selectComp.onChange(value);
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