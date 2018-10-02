import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PerfumeModule } from '../../../angular/dist/perfume';

// Componentes
import { AppComponent } from './app.component';
import { DialogComponent } from './dialog/dialog.component';

@NgModule({
  declarations: [AppComponent, DialogComponent],
  imports: [
    PerfumeModule.forRoot({
      firstPaint: true,
      firstContentfulPaint: true,
      firstInputDelay: true,
      timeToInteractive: true,
      analyticsTracker: (metricName: string, duration: number) => {
        console.log('Analytics Tracker', metricName, duration);
      },
      googleAnalytics: {
        enable: true,
        timingVar: 'userId',
      },
    }),
    BrowserAnimationsModule,
    BrowserModule,
    MatDialogModule,
  ],
  providers: [],
  entryComponents: [DialogComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
