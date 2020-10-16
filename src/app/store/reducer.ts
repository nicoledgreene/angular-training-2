import { state } from '@angular/animations';
import { createReducer } from '@ngrx/store';

import { getAllOrders } from './actions';

export const initialState = {
    orders: []
}
