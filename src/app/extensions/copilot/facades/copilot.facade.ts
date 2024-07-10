import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getCopilotToolCall } from '../store/copilot-store';
import { setActiveTool } from '../store/copilot.actions';

/* eslint-disable @typescript-eslint/member-ordering */
@Injectable({ providedIn: 'root' })
export class CopilotFacade {
  constructor(private store: Store) {}

  copilotToolCall$ = this.store.pipe(select(getCopilotToolCall));

  setCopilotToolCall(tool: string) {
    this.store.dispatch(setActiveTool({ tool }));
  }
}
