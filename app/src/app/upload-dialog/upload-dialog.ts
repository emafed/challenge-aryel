import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'upload-dialog',
    templateUrl: 'upload-dialog.html',
})

export class UploadDialog {
    constructor(public dialog: MatDialog) { }
}