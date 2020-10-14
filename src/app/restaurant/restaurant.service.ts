import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { Restaurant } from './restaurant';

export interface ResponseData<dataType> {
  data: dataType[];
}

export interface State {
  name: string;
  short: string;
}

export interface City {
  name: string;
  state: string;
}

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  constructor(private httpClient: HttpClient) { }

  public getRestaurants(state: string, city: string): Observable<ResponseData<Restaurant>> {
    const params = new HttpParams().set('filter[address.state]', state).set('filter[address.city]', city);
    return this.httpClient.get<ResponseData<Restaurant>>(`${environment.apiUrl}/restaurants`, {params});
  }

  public getRestaurant(slug: string): Observable<Restaurant> {
    return this.httpClient.get<Restaurant>(`${environment.apiUrl}/restaurants/${slug}`);
  }

  public getStates(): Observable<ResponseData<State>> {
    return this.httpClient.get<ResponseData<State>>(`${environment.apiUrl}/states`);
  }

  public getCities(state: string): Observable<ResponseData<City>> {
    const params = new HttpParams().set('state', state);
    return this.httpClient.get<ResponseData<City>>(`${environment.apiUrl}/cities`, {params});
  }
}
