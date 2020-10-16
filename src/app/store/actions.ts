import { createAction, props } from '@ngrx/store';
import { Order } from '../order/order.service';

export const getAllOrders = createAction('[History Component] GetAllOrders');

export const ordersLoadedSuccess = createAction(
    '[History Component] OrderLoadedSuccess', 
    props<{orders: Order[]}>()
);
