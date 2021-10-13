import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.css'],
})
export class CarDetailsComponent implements OnInit {

  image: string;
  defaultImage: string = "https://lasd.lv/public/assets/no-image.png";

  constructor(
    public dialogRef: MatDialogRef<CarDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { image: string }
  ) {
    this.image = data.image ? data.image : this.defaultImage;
    dialogRef.beforeClosed().subscribe(() => {
      dialogRef.close((this.image != this.defaultImage) ? this.image : "");
    });
  }

  ngOnInit(): void {}

  editImage() {
    this.setImage(prompt("Enter Image URL:") as string);
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

}
