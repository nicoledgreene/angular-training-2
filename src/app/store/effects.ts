import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError } from 'rxjs/operators';
import { OrderService } from '../order/order.service';

@Injectable()
export class OrderEffect {

    loadOrder$ = createEffect(() => this.action$.pipe(
        ofType('[History Component] GetAllOrders'),
        mergeMap(() => this.orderService.getOrders()
            .pipe(
                map(response => {
                    type: '[History Component], OrderLoadedSuccess'
                    orders: response.data
                })
            )
        ),
        { dispatch: false }
    );

    constructor(
        private action$: Actions,
        private orderService: OrderService,
    ) {

    }
}