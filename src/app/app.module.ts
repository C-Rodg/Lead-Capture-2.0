import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';

import { Dashboard } from '../pages/dashboard/dashboard';
import { List } from '../pages/list/list';
import { Device } from '../pages/device/device';
import { Settings } from '../pages/settings/settings';
import { AddModal } from '../pages/device/add-modal/add-modal';
import { ScanCamera } from '../pages/scan-camera/scan-camera';
import { ScanSled } from '../pages/scan-sled/scan-sled';
import { Record } from '../pages/record/record';
import { TextInput, TextArea, PickoneInput, PickmanyInput, CheckboxInput } from '../pages/form-items/';

import { ParseBadgeService } from '../providers/parseBadgeService';
import { SettingsService } from '../providers/settingsService';
import { ScanCameraService } from '../providers/scanCameraService';
import { ScanSledService } from '../providers/scanSledService';

import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2,
    Dashboard,
    List,
    ScanCamera,
    ScanSled,
    Device,
    Settings,
    AddModal,
    Record,
    TextInput,
    TextArea,
    PickoneInput,
    PickmanyInput,
    CheckboxInput
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      mode : 'md'
    })
    ,ReactiveFormsModule
    //,FormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2,
    Dashboard,
    List,
    ScanCamera,
    ScanSled,
    Device,
    Settings,
    AddModal,
    Record
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, 
    SettingsService, 
    ParseBadgeService,
    ScanCameraService,
    ScanSledService
    ]
})
export class AppModule {}
