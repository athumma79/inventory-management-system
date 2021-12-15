import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageURLPromptComponent } from '../image-url-prompt/image-url-prompt.component';
import { CarService } from '../services/car.service';

@Component({
  selector: 'app-car-image-modal',
  templateUrl: './car-image-modal.component.html',
  styleUrls: ['./car-image-modal.component.css'],
})
export class CarImageModalComponent implements OnInit {

  image: string;
  defaultImage: string = "https://lasd.lv/public/assets/no-image.png";
  label: string;
  vin: string;

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<CarImageModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { image: string, label: string, vin: string },
    private carService: CarService
  ) {
    this.image = data.image ? data.image : this.defaultImage;
    this.label = data.label.trim().length > 0 ? data.label.trim() : "Car";
    this.vin = data.vin;
    dialogRef.beforeClosed().subscribe(() => {
      dialogRef.close(this.getImageToPass(null));
    });
  }

  ngOnInit(): void {}

  editImage() {
    let dialogRef = this.dialog.open(ImageURLPromptComponent, {
      data: { image: this.getImageToPass("") },
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
      this.carService.updateCarImage(this.vin, this.getImageToPass(null));
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

  getImageToPass(noImage: string | null) {
    return (this.image != this.defaultImage) ? this.image : noImage;
  }

}