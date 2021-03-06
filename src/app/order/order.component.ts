import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, AbstractControl } from '@angular/forms';

import { RestaurantService } from '../restaurant/restaurant.service';
import { Restaurant } from '../restaurant/restaurant';
import { Subscription } from 'rxjs';

import { OrderService, Order, Item } from './order.service';

//CUSTOM VALIDATION FUNCTION TO ENSURE THAT THE ITEMS FORM VALUE CONTAINS AT LEAST ONE ITEM. 
function minLengthArray(min: number) {
  return (c: AbstractControl): {[key: string]: any} => {
      if (c.value.length >= min)
          return null;
      return { 'minLengthArray': {valid: false }};
  }
}

@Component({
  selector: 'pmo-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.less']
})
export class OrderComponent implements OnInit, OnDestroy {
  orderForm: FormGroup;
  restaurant: Restaurant;
  isLoading: boolean = true;
  items: FormArray;
  orderTotal: number = 0.0;
  completedOrder: Order;
  orderComplete: boolean = false;
  orderProcessing: boolean = false;
  private subscription: Subscription;

  constructor(
    private route: ActivatedRoute, 
    private restaurantService: RestaurantService,
    private formBuilder: FormBuilder,
    private orderService: OrderService,
  ) { 
  }

  ngOnInit() {
    const restaurantSlug = this.route.snapshot.paramMap.get('slug');

    this.restaurantService.getRestaurant(restaurantSlug).subscribe(_res => {
      this.restaurant = _res;
      this.isLoading = false;

      this.createOrderForm();
    })
  }

  createOrderForm() {
    //CREATE AN ORDER FORM TO COLLECT: RESTAURANT ID, NAME, ADDRESS, PHONE, AND ITEMS
    this.orderForm = this.formBuilder.group({
      restaurant: [this.restaurant._id],
      name: [null],
      address: [null],
      phone: [null],
    // ITEMS SHOULD USE THE CUSTOM MINLENGTH ARRAY VALIDATION
      items: [[], minLengthArray(1)]
    });
    this.onChanges();
  }

  onChanges() {
    this.subscription = this.orderForm.get('items').valueChanges.subscribe(val => {
      let total = 0.0;
      val.forEach((item: Item) => {
        total += item.price;
      });
      this.orderTotal = Math.round(total * 100) / 100;
    });
  }

  startNewOrder() {
    this.orderComplete = false;
    this.orderTotal = 0.0;
    this.createOrderForm();
  }

  onSubmit() {
    this.orderProcessing = true;
    this.orderService.createOrder(this.orderForm.value).subscribe((res: Order) => {
      this.completedOrder = res;
      this.orderComplete = true;
      this.orderProcessing = false;
    });
  }

  getChange(newItems:any[]) {
    let currentItems = this.orderForm.get('items').value;

    for (let i = 0; i < newItems.length; i++) {
      let item = newItems[i];
      let idx = currentItems.indexOf(item);
      if (idx === -1) {
        currentItems.push(item);
      }
      
    }
    this.orderForm.get('items').patchValue(newItems);
  }

  ngOnDestroy(): void {
    this.subscription && this.subscription.unsubscribe && this.subscription.unsubscribe();
  }
}
