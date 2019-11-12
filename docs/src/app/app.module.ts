import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { DialogComponent } from './dialog/dialog.component';
import { NavigationComponent } from './navigation/navigation.component';
import { IntroComponent } from './intro/intro.component';
import { CfpComponent } from './cfp/cfp.component';

import { PerfumeModule } from 'perfume.js/angular';
// import Perfume from '../../../';

// Supports AOT and DI
export function analyticsTracker({ metricName, data, duration, browser }) {
  if (data) {
    console.log(`Analytics ${metricName}, Browser ${browser.name}, OS ${browser.os}:`, data);
  } else {
    console.log(`Analytics ${metricName}, Browser ${browser.name}, OS ${browser.os}:`, duration);
  }
}
export const PerfumeConfig = {
  firstPaint: true,
  firstContentfulPaint: true,
  firstInputDelay: true,
  dataConsumption: true,
  largestContentfulPaint: true,
  navigationTiming: true,
  analyticsTracker,
  browserTracker: true,
};

/*
new Perfume({ ...PerfumeConfig, ...{
  pageResource: true,
  logPrefix: 'Perfume Vanilla:',
}});
*/

@NgModule({
  declarations: [
    AppComponent,
    DialogComponent,
    NavigationComponent,
    IntroComponent,
    CfpComponent,
  ],
  imports: [
    PerfumeModule.forRoot(PerfumeConfig),
    BrowserAnimationsModule,
    BrowserModule,
    MatDialogModule,
  ],
  providers: [],
  entryComponents: [DialogComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
