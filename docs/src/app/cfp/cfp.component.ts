import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

// import { NgPerfume } from 'perfume.js/angular';
import { NgPerfume } from '../../../projects/perfume/src/lib/perfume.module';

import { openDialog$ } from '../perfume.config';

@Component({
  selector: 'app-cfp',
  templateUrl: './cfp.component.html',
  styles: [``],
  encapsulation: ViewEncapsulation.None,
})
export class CfpComponent implements AfterViewInit {
  logOpenDialog: string;
  path: string;
  private gifIndex = 0;

  constructor(
    private ref: ChangeDetectorRef,
    public dialog: MatDialog,
    public perfume: NgPerfume,
  ) {
    this.path = window.location.href.split('#')[0];
  }

  ngAfterViewInit() {
    openDialog$.subscribe(result => {
      this.logOpenDialog = `Perfume.js: openDialog ${result} ms`;
      this.ref.detectChanges();
    });
  }

  openDialog() {
    this.perfume.start('openDialog');
    this.dialog.open(DialogComponent, {
      data: { gifIndex: this.gifIndex },
      width: '50%',
    });
    // Increment or reset index
    this.gifIndex = this.gifIndex === 4 ? 0 : this.gifIndex + 1;
    this.perfume.endPaint('openDialog');
  }
}
