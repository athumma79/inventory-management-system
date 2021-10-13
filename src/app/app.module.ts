import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { AppComponent } from './app.component';
import { CarDetailsComponent } from './car-details/car-details.component';
import { InvalidInputAlertComponent } from './invalid-input-alert/invalid-input-alert.component';
import { ImageURLPromptComponent } from './image-url-prompt/image-url-prompt.component';

@NgModule({
  declarations: [
    AppComponent,
    CarDetailsComponent,
    InvalidInputAlertComponent,
    ImageURLPromptComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule
  ],
  entryComponents: [
    CarDetailsComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
