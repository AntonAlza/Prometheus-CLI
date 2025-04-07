import {
    ChangeDetectorRef,
    Directive,
    ElementRef,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Component,
    Inject,
  } from '@angular/core';
  
  import { fromEvent, Subject, of as observableOf } from 'rxjs';
  import { map, switchMap, takeUntil } from 'rxjs/operators';
  import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
  
  import ResizeObserver from 'resize-observer-polyfill';
  

  
  @Component({
    selector: 'dialog-overview-example',
    templateUrl: 'dialog-overview-example.html',
  })
  export class DialogOverviewExampleDialog {
  
    constructor(
      public dialogRef: MatDialogRef<DialogOverviewExampleDialog>) { }
      onNoClick(): void {
      this.dialogRef.close();
    }
  
  }
  
  