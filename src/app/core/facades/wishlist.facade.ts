import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Wishlist } from 'ish-core/models/wishlist/wishlist.model';
import { loadWishlist } from 'ish-core/store/core/wishlist/wishlist.actions';
import { getWishlist, getWishlistError } from 'ish-core/store/core/wishlist/wishlist.selectors';

@Injectable({ providedIn: 'root' })
export class WishlistFacade {
  constructor(private store: Store) {}

  wishlist$: Observable<Wishlist> = this.store.pipe(select(getWishlist));
  wishlistError$: Observable<HttpError> = this.store.pipe(select(getWishlistError));

  loadWishlist(id: string, owner: string, secureCode: string) {
    this.store.dispatch(loadWishlist({ id, owner, secureCode }));
  }
}
