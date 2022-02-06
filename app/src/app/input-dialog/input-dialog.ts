import { Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'input-dialog',
    templateUrl: 'input-dialog.html',
})

export class InputDialog {
    result: string = "";
    title: string= "";
    submitText: string = ""
    constructor(
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        if(data.type =="newFolder"){
           this.result = "Cartella senza nome";
           this.title = "Nuova cartella";
           this.submitText = "Crea";
        }else if(data.type == "rename"){
            this.result = data.oldName;
            this.title = "Rinomina";
            this.submitText = "Fatto";
        }
    }
    
}