import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, AbstractControl } from '@angular/forms';

import { RestaurantService } from '../restaurant/restaurant.service';
import { Restaurant } from '../restaurant/restaurant';
import { Subscription } from 'rxjs';

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
  completedOrder: any;
  orderComplete: boolean = false;
  orderProcessing: boolean = false;
  private subscription: Subscription;

  constructor(
    private route: ActivatedRoute, 
    private restaurantService: RestaurantService,
    private formBuilder: FormBuilder 
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
    // SUBSCRIBE TO THE ITEMS FORMCONTROL CHANGE TO CALCULATE A NEW TOTAL
    this.subscription = this.orderForm.get('items').valueChanges.subscribe(_val => {
      let total = 0.0;
      if(_val.length) {
        _val.forEach((item: any) => {
          total += item.price;
        });
        this.orderTotal = Math.round(total * 100) / 100;
      }
      else {
        this.orderTotal = total;
      }
    })
  }

  startNewOrder() {
    this.orderComplete = false;
    this.completedOrder = this.orderForm.value;
    //CLEAR THE ORDER FORM
    this.createOrderForm();
  }

  onSubmit() {
    //todo
  }

  ngOnDestroy(): void {
    this.subscription && this.subscription.unsubscribe && this.subscription.unsubscribe();
  }
}
