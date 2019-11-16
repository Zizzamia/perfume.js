import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { DialogComponent } from './dialog/dialog.component';
import { NavigationComponent } from './navigation/navigation.component';
import { IntroComponent } from './intro/intro.component';
import { CfpComponent } from './cfp/cfp.component';
import { PerfumeConfig } from './perfume.config';

import { PerfumeModule } from 'perfume.js/angular';
// import { PerfumeModule } from '../../projects/perfume/src/lib/perfume.module';

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
