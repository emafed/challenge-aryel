import { Component, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InputDialog } from './input-dialog/input-dialog';
import { HttpService } from './http-service/http.service';
import { ViewChild } from '@angular/core';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as FileSaver from 'file-saver';

export interface Files {
  parentId: String,
  fileName: String,
  originalFileName: String,
  size: Number,
  extension: String,
  mime: String,
  loadDate: Date
  modDate: Date
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  constructor(private dialog: MatDialog, private httpService: HttpService, private _snackBar: MatSnackBar) { }
  title = 'challenge-aryel';
  displayedColumns: string[] = ['type', 'fileName', 'size', 'loadDate', 'modDate', 'opt'];
  dataSource: any;
  progress: any = undefined;
  clickedRows = new Set<Files>();
  navigationTree: string[] = []
  navigationName: string[] = ["Home"]
  disableRipple: boolean = false;

  @ViewChild('fileInput')
  fileInputVar: ElementRef | undefined;


  ngOnInit() {
    this.getFiles()
  }

  openDialogNewFolder() {
    const dialogRef = this.dialog.open(InputDialog, {
      disableClose: true,
      data: { type: "newFolder" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.action == "C") {
        let parentId = this.navigationTree[this.navigationTree.length - 1]
        this.httpService.createFolder(result.result, parentId).subscribe((res) => {
          this.getFiles();
        })
      }
    });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, undefined, {
      duration: 3000,
      panelClass: ['mat-toolbar', 'mat-primary']
    });
  }

  getFiles(row?: any) {
    let newId = "";
    if (row == undefined) {
      if (this.navigationTree[this.navigationTree.length - 1] == undefined) {
        newId = "";
      } else {
        newId = this.navigationTree[this.navigationTree.length - 1];
      }
    } else {
      newId = row._id;
    }
    this.httpService.getFiles(newId).subscribe(files => {
      this.dataSource = files;
    });
  }

  manageFolderClick(id: string) {
    this.manageNavigation(id);
    this.getFiles(id);
  }

  deleteFile(_id: String) {
    this.httpService.deleteFile(_id).subscribe({
      complete: () => {
        this.getFiles();
        this.openSnackBar("File eliminato");
      },
      error: console.error
    });
  }

  rename(_id: string, oldName: string) {
    const dialogRef = this.dialog.open(InputDialog, {
      disableClose: true,
      data: {
        type: "rename",
        oldName: oldName
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.action == "C") {
        this.httpService.rename(_id, result.result).subscribe((res) => {
          this.getFiles();
        })
      }
    });
  }

  downloadFile(_id: String) {
    this.httpService.downloadFile(_id).subscribe(x => {
      let fileName = ((x.headers.get("Content-Disposition")).split('filename=')[1].split(';')[0]).replaceAll('"', '')
      FileSaver.saveAs(x.body, fileName)
    });
  }

  onFileSelected(event: any) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      let parentId = this.navigationTree[this.navigationTree.length - 1]
      formData.append('file', file, file.name);
      this.httpService.upload(formData, parentId).subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progress = Math.round(event.loaded / event.total! * 100);
            break;
          case HttpEventType.Response:
            setTimeout(() => {
              this.progress = undefined;
              this.getFiles();
              this.openSnackBar("Caricamento completato")
            }, 1500);

        }
      })
    }
    this.fileInputVar!.nativeElement.value = "";
  }

  manageNavigation(row?: any) {
    if (row != undefined) {
      this.navigationTree.push(row._id);
      this.navigationName.push(row.fileName);
    } else {
      this.navigationTree.pop();
      this.navigationName.pop();
      this.getFiles();
    }
  }
  getNavigationName(): string {
    let ret = "";
    this.navigationName.forEach((element) => {
      ret += "/" + element
    })
    return ret;

  }

}
