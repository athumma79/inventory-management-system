import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Car } from '../models/car';

@Injectable({
  providedIn: 'root',
})
export class CarService {  
  constructor(private httpClient: HttpClient) {}

  getCars(callback: Function) {
    this.httpClient.get(environment.api + '/cars').subscribe((data: any) => {
      callback(data);
    });
  }

  addCar(car: Car) {
    this.httpClient.post(environment.api + '/cars', { "car": car }).subscribe();
  }

  updateCar(car: Car, vin: string) {
    this.httpClient.put(environment.api + '/cars/' + vin, { "car": car }).subscribe();
  }

  deleteCar(vin: string) {
    this.httpClient.delete(environment.api + '/cars/' + vin).subscribe();
  }

  updateCarImage(vin: string, image: string | null) {
    this.httpClient.post(environment.api + '/cars/' + vin + '/image', { "image": image }).subscribe();
  }
}