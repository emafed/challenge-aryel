import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from '../http-service/http.service';

@Component({
    selector: 'newfolder-dialog',
    templateUrl: 'newfolder-dialog.html',
})

export class NewFolderDialog {
    constructor(public dialog: MatDialog, private fileUploadService: HttpService) { }
    fileToUpload: any | null = null;
      srcResult:any
      onFileSelected() {
        const inputNode: any = document.querySelector('#file');
      
        if (typeof (FileReader) !== 'undefined') {
          const reader = new FileReader();
      
          reader.onload = (e: any) => {
            this.srcResult = e.target.result;
            console.log(e)
          };
      
          reader.readAsArrayBuffer(inputNode.files[0]);
        }
      }
}