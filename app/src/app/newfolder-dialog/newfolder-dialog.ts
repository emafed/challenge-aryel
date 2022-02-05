import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'newfolder-dialog',
    templateUrl: 'newfolder-dialog.html',
})

export class NewFolderDialog {
    constructor(public dialog: MatDialog) { }
    result: string = "Cartella senza nome";
}