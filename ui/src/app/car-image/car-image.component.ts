import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageURLPromptComponent } from '../image-url-prompt/image-url-prompt.component';

@Component({
  selector: 'app-car-image',
  templateUrl: './car-image.component.html',
  styleUrls: ['./car-image.component.css'],
})
export class CarImageComponent implements OnInit {

  image: string;
  defaultImage: string = "https://lasd.lv/public/assets/no-image.png";
  label: string;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CarImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { image: string, label: string }
  ) {
    this.image = data.image ? data.image : this.defaultImage;
    this.label = data.label.trim().length > 0 ? data.label.trim() : "Car";
    dialogRef.beforeClosed().subscribe(() => {
      dialogRef.close(this.getImageToPass());
    });
  }

  ngOnInit(): void {}

  editImage() {
    let dialogRef = this.dialog.open(ImageURLPromptComponent, {
      data: { image: this.getImageToPass() },
      width: '450px'
    });
    dialogRef.afterClosed().subscribe((url) => {
      this.setImage(url);
    });
  }

  deleteImage() {
    this.setImage();
  }

  setImage(url: string = this.defaultImage) {
    this.isImageValid(url, (isValid: boolean) => {
      this.image = isValid ? url : this.defaultImage;
    });
  }

  isImageValid(url: string, callback: Function) {
    var image = new Image();
    image.onload = function() {
      callback(true);
    }
    image.onerror = function() {
      callback(false);
    }
    image.src = url;
  }

  getImageToPass() {
    return (this.image != this.defaultImage) ? this.image : "";
  }

}