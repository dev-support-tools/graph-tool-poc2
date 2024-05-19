import { Component, Inject } from '@angular/core';
import { Image } from '../map-view/nodeex';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {

  image: Image;
}


@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss']
})
export class ImageDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    console.log(this.data);
  }

  public get selectedImageUrl(): string {
    console.log('selectedImageUrl')
    console.log(this.data.image.url)
    return this.data.image.url;
  }

  public onClickImage() {
    this.dialogRef.close();
  }

  onOkClick(): void {
    this.dialogRef.close();
  }

}
