import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { anything, spy, verify } from 'ts-mockito';

import { coreReducers } from 'ish-core/store/core-store.module';
import { MockComponent } from 'ish-core/utils/dev/mock.component';
import { LoadQuotes } from '../../../../store/quote';
import { LoadQuoteRequests } from '../../../../store/quote-request';
import { quotingReducers } from '../../../../store/quoting-store.module';

import { QuoteWidgetContainerComponent } from './quote-widget.container';

describe('Quote Widget Container', () => {
  let component: QuoteWidgetContainerComponent;
  let fixture: ComponentFixture<QuoteWidgetContainerComponent>;
  let element: HTMLElement;
  let store$: Store<{}>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({ ...coreReducers, quoting: combineReducers(quotingReducers) }),
        TranslateModule.forRoot(),
      ],
      declarations: [
        MockComponent({
          selector: 'ish-loading',
          template: 'Loading',
          inputs: ['quoteLoading', 'quoteRequestLoading'],
        }),
        MockComponent({
          selector: 'ish-quote-widget',
          template: 'Quote Widget',
          inputs: ['quoteRequests', 'quotes'],
        }),
        QuoteWidgetContainerComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteWidgetContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    store$ = TestBed.get(Store);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should dispatch action when addToQuote is triggered.', () => {
    const storeSpy$ = spy(store$);

    fixture.detectChanges();

    verify(storeSpy$.dispatch(anything())).twice();
  });

  it('should render loading component if quotes loading', () => {
    store$.dispatch(new LoadQuotes());
    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });

  it('should render loading component if quoteRequests loading', () => {
    store$.dispatch(new LoadQuoteRequests());
    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });
});
