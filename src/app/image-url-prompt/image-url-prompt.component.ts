import { Component, Inject, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-image-url-prompt',
  templateUrl: './image-url-prompt.component.html',
  styleUrls: ['./image-url-prompt.component.css']
})
export class ImageURLPromptComponent implements OnInit {

  url: string;

  constructor(
    public dialogRef: MatDialogRef<ImageURLPromptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { image: string }
  ) {
    this.url = data.image;
    dialogRef.beforeClosed().subscribe(() => {
      this.close();
    });
  }

  ngOnInit(): void {
  }

  submit() {
    this.url = $("#url-input").val() as string;
    this.close();
  }

  close() {
    this.dialogRef.close(this.url);
  }

}
