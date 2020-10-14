import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { RestaurantService, ResponseData, State, City } from './restaurant.service';
import { Restaurant } from './restaurant';
import { Observable, Subscription } from 'rxjs';
import { map, startWith, tap, switchMap, withLatestFrom, filter } from 'rxjs/operators';

export interface Data<dataType> {
  value: dataType[];
  isPending: boolean;
}

@Component({
  selector: 'pmo-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.less']
})
export class RestaurantComponent implements OnInit {
  form: FormGroup;

  public states$: Observable<Data<State>>;
  public cities$: Observable<Data<City>>;
  public restaurant$: Observable<Data<Restaurant>>;

  subscription: Subscription;

  constructor(private restaurantService: RestaurantService, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.createForm();

    this.states$ = this.restaurantService.getStates().pipe(
      map((res: ResponseData<State>) => {
        return {
          value: res.data,
          isPending: false
        }
      }),
      startWith({
        value: [],
        isPending: true
      }),
      tap((states) => {
        this.form.get('city').patchValue('');
        if(states.value.length) {
          this.form.get('state').enable();
        } else {
          this.form.get('state').disable();
        }
      })
    )

    this.cities$ = this.form.get('state').valueChanges.pipe(
      switchMap((value: string) => {
        return this.restaurantService.getCities(value)
      }),
      map((res: ResponseData<City>) => {
        return {
          value: res.data,
          isPending: false
        }
      }),
      startWith({
        value: [],
        isPending: true
      }),
      tap((cities) => {
        if(cities.value.length) {
          this.form.get('city').enable();
        } else {
          this.form.get('city').disable();
        }
      })
    )

    this.restaurant$ = this.form.get('city').valueChanges.pipe(
      filter((value: string) => value !== ''),
      withLatestFrom(this.form.get('state').valueChanges),
      switchMap(([city, state]) => {
        return this.restaurantService.getRestaurants(state, city);
      }),
      map((res: ResponseData<Restaurant>) => {
        return {
          value: res.data,
          isPending: false
        }
      }),
      startWith({
        value: [],
        isPending: true
      })
    )
  }

  createForm() {
    this.form = this.fb.group({
      city: {value: '', disabled: true},
      state: {value: '', disabled: true}
    })
  }
}
//   ngOnDestroy() {
//     // this.subscription && this.subscription.unsubscribe && this.subscription.unsubscribe();
//   }

// }

  // onChanges() {
  //   let state: string;

  //   const stateSub = this.form.get('state').valueChanges.subscribe(_val => {
  //     console.log(_val);
  //     this.restaurants.value = []; //reset restaurants

  //     if(_val) {
  //       //if there is a value selected- enable city dropdown
  //       this.form.get('city').enable({
  //         onlySelf: true,
  //         emitEvent: false
  //       })
  //       //clear prev city value if new state selected
  //       if(state !== _val) {
  //         this.form.get('city').patchValue(''); //reset list of cities
  //       }

  //       state = _val;
  //       this.getCities(_val);
  //     } else {
  //       //disable city if no value selected
  //       this.form.get('city').disable({
  //         onlySelf: true,
  //         emitEvent: false
  //       });
  //       state = ''; //reset the state to an empty string
  //     }
  //   })
  //   this.subscription = stateSub;

  //   const citySub = this.form.get('city').valueChanges.subscribe(val => {
  //     if(val) {
  //       this.getRestaurants(val, state);
  //     }
  //   });
  //   this.subscription.add(citySub);
  // }

  // getStates() {
  //   this.restaurantService.getStates().subscribe((res: ResponseData<State>) => {
  //     console.log('get states: ', res);
  //     this.states.value = res.data;
  //     this.states.isPending = false;
  //     this.form.get('state').enable({
  //       onlySelf: true,
  //       emitEvent: false
  //     });
  //   });
  // }

  // getCities(_state: string) {
  //   this.cities.isPending = true; //need to set cities to pending until fetched
  //   this.restaurantService.getCities(_state).subscribe((_res: ResponseData<City>) => {
  //     this.cities.value = _res.data;
  //     this.cities.isPending = false;
  //     this.form.get('city').enable({
  //       onlySelf: true,
  //       emitEvent: false
  //     });
  //   });
  // }

  // getRestaurants(_city: string, _state: string) {
  //   this.restaurantService.getRestaurants(_state, _city).subscribe((_res: ResponseData<Restaurant>) => {
  //     this.restaurants.value = _res.data;
  //     this.restaurants.isPending = false;
  //   })
  // }

// }