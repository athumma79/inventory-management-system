import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.css'],
})
export class CarDetailsComponent implements OnInit {

  image: string;
  defaultImage: string = "https://lasd.lv/public/assets/no-image.png";

  constructor(@Inject(MAT_DIALOG_DATA) public data: { image: string }) {
    this.image = data.image ? data.image : this.defaultImage;
  }

  ngOnInit(): void {}

  editImage() {

  }

  deleteImage() {

  }

}
