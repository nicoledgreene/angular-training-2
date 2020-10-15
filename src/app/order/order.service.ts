import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Item {
  name: string;
  price: number;
}

export interface Order {
  _id: string;
  name: string;
  address: string;
  phone: string;
  status: string;
  items: Array<Item>;
}

@Injectable({
  providedIn: 'root'
})

export class OrderService {

  constructor(private httpClient: HttpClient) { }

  public getOrders(): Observable<any> {
    return this.httpClient.get(environment.apiUrl + '/orders');
  }

  public createOrder(order: Order): Observable<any> {
    let orderData = Object.assign({}, order);
    orderData.status = 'new';
    return this.httpClient.post(environment.apiUrl + '/orders', orderData)
  }

  public updateOrder(order: Order, action: string): Observable<any> {
    let orderData = Object.assign({}, order);
    orderData.status = action;
    return this.httpClient.put(environment.apiUrl + '/orders/' + orderData._id, orderData);
  }

  public deleteOrder(id: string): Observable<any> {
    return this.httpClient.delete(environment.apiUrl + '/orders/' + id);
  }
}