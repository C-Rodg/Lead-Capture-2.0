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

import { TextInput } from '../pages/record/textInput';

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
    TextInput
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      mode : 'md'
    })
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
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
