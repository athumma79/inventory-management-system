import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { AppComponent } from './app.component';
import { CarImageModalComponent } from './car-image-modal/car-image-modal.component';
import { ErrorAlertComponent } from './error-alert/error-alert.component';
import { ImageURLPromptComponent } from './image-url-prompt/image-url-prompt.component';

@NgModule({
  declarations: [
    AppComponent,
    CarImageModalComponent,
    ErrorAlertComponent,
    ImageURLPromptComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule
  ],
  entryComponents: [],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
