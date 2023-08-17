import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { first, isObservable, of, switchMap } from 'rxjs';

import { IdentityProviderFactory } from 'ish-core/identity-provider/identity-provider.factory';
import { isPromise } from 'ish-core/utils/functions';
import { whenTruthy } from 'ish-core/utils/operators';

export function identityProviderInviteGuard(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  const identityProviderFactory = inject(IdentityProviderFactory);

  return identityProviderFactory.initialized$.pipe(
    whenTruthy(),
    first(),
    switchMap(() => {
      if (identityProviderFactory.getInstance().triggerInvite) {
        const inviteReturn$ = identityProviderFactory.getInstance().triggerInvite(route, state);
        return isObservable(inviteReturn$) || isPromise(inviteReturn$) ? inviteReturn$ : of(inviteReturn$);
      } else {
        return of(false);
      }
    })
  );
}
