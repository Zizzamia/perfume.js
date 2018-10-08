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

// Supports AOT and DI
export function analyticsTracker(metricName: string, duration: number) {
  console.log('Analytics Tracker', metricName, duration);
}

@NgModule({
  declarations: [
    AppComponent,
    DialogComponent,
    NavigationComponent,
    IntroComponent,
    CfpComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    MatDialogModule,
    PerfumeModule.forRoot({
      firstPaint: true,
      firstContentfulPaint: true,
      firstInputDelay: true,
      timeToInteractive: true,
      analyticsTracker,
      googleAnalytics: {
        enable: true,
        timingVar: 'userId',
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
