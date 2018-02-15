import { routerReducer } from '@ngrx/router-store';
import { ActionReducerMap } from '@ngrx/store';
import { State } from './core.state';
import { RouterEffects } from './router/router.effects';
import { UserEffects } from './user/user.effects';
import { userReducer } from './user/user.reducer';


export const reducers: ActionReducerMap<State> = {
  routerReducer: routerReducer,
  user: userReducer,
};

export const effects: any[] = [UserEffects, RouterEffects];

export * from './router/router.serializers';
