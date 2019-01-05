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
export function analyticsTracker(metricName: string, duration: number, browser) {
  console.log('Analytics Tracker', metricName, duration, browser.name, browser.os);
}
export const PerfumeConfig = {
  firstPaint: true,
  firstContentfulPaint: true,
  firstInputDelay: true,
  analyticsTracker,
  browserTracker: true,
  googleAnalytics: {
    enable: true,
    timingVar: 'userId',
  },
};

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
