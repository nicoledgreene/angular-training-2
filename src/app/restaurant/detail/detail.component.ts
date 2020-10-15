import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { map, multicast, refCount, switchMap, tap } from 'rxjs/operators';
import { Restaurant } from '../restaurant';
import { RestaurantService } from '../restaurant.service';

@Component({
  selector: 'pmo-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.less']
})
export class DetailComponent implements OnInit {

  restaurant$: Observable<Restaurant>;
  isLoading$: Observable<boolean>;

  constructor(private route: ActivatedRoute, private restaurantService: RestaurantService) { }

  ngOnInit() {
    this.restaurant$ = this.route.paramMap.pipe(
      switchMap((paramMap: ParamMap) => {
        const slug = paramMap.get('slug');
        return this.restaurantService.getRestaurant(slug);
      }),
      multicast(new ReplaySubject(1)),
      refCount()
    )

    this.isLoading$ = this.restaurant$.pipe(
      map((restaurant: Restaurant) => {
        return !restaurant;
      })
    )
  }

  getUrl(image:string): string {
    // THIS IS A DIFFERENT WAY TO HANDLE THE IMAGE PATH
    return image.replace('node_modules/place-my-order-assets', './assets')
  }

}