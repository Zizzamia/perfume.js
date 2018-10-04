import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';

// import { PerfumeAfterViewInit } from '../../../../angular/';
import { NgPerfume, PerfumeAfterViewInit } from 'perfume.js/angular';

@Component({
  selector: 'app-cfp',
  templateUrl: './cfp.component.html',
  styles: [``],
  encapsulation: ViewEncapsulation.None,
})
@PerfumeAfterViewInit()
export class CfpComponent implements AfterViewInit {
  logOpenDialog: string;
  path: string;
  private gifIndex = 0;

  constructor(public dialog: MatDialog, private perfume: NgPerfume) {
    this.path = window.location.href.split('#')[0];
  }

  ngAfterViewInit() {}

  async openDialog() {
    this.perfume.start('openDialog');
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { gifIndex: this.gifIndex },
      width: '50%',
    });
    // Increment or reset index
    this.gifIndex = this.gifIndex === 4 ? 0 : this.gifIndex + 1;
    const duration = await this.perfume.endPaint('openDialog');
    this.logOpenDialog = `⚡️ Perfume.js: openDialog ${duration} ms`;
  }
}
