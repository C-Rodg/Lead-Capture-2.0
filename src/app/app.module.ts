import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import { MyApp } from './app.component';

import { Dashboard } from '../pages/dashboard/dashboard';
import { List } from '../pages/list/list';
import { Device } from '../pages/device/device';
import { Settings } from '../pages/settings/settings';
import { AddModal } from '../pages/device/add-modal/add-modal';
import { ScanCamera } from '../pages/scan-camera/scan-camera';
import { ScanSled } from '../pages/scan-sled/scan-sled';
import { NewRecord } from '../pages/new-record/new-record';
import { EditRecord } from '../pages/edit-record/edit-record';
import { TextInput, TextArea, PickoneInput, PickmanyInput, CheckboxInput } from '../pages/form-items/';

import { ParseBadgeService } from '../providers/parseBadgeService';
import { SettingsService } from '../providers/settingsService';
import { ScanCameraService } from '../providers/scanCameraService';
import { ScanSledService } from '../providers/scanSledService';
import { SoundService } from '../providers/soundService';
import { InfoService } from '../providers/infoService';
import { LeadsService } from '../providers/leadsService';

import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MyApp,
    Dashboard,
    List,
    ScanCamera,
    ScanSled,
    Device,
    Settings,
    AddModal,
    NewRecord,
    TextInput,
    TextArea,
    PickoneInput,
    PickmanyInput,
    CheckboxInput,
    EditRecord
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      mode : 'md'
    })
    ,ReactiveFormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Dashboard,
    List,
    ScanCamera,
    ScanSled,
    Device,
    Settings,
    AddModal,
    NewRecord,
    EditRecord
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, 
    InfoService,
    SettingsService, 
    LeadsService,
    ParseBadgeService,
    ScanCameraService,
    ScanSledService,
    SoundService
    ]
})
export class AppModule {}
