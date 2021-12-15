import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error-alert',
  templateUrl: './error-alert.component.html',
  styleUrls: ['./error-alert.component.css']
})
export class ErrorAlertComponent implements OnInit {

  message: string;

  constructor(@Inject(MAT_DIALOG_DATA) private data: { message: string }) { 
    this.message = data.message;
  }

  ngOnInit(): void {
  }

}
