import { HttpErrorResponse } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { CustomFormsModule } from 'ng2-validation';
import { USE_SIMPLE_ACCOUNT, USER_REGISTRATION_LOGIN_TYPE } from '../../../core/configurations/injection-keys';
import { FormUtilsService } from '../../../core/services/utils/form-utils.service';
import { reducers } from '../../../core/store/core.system';
import { LoginUserFail, State } from '../../../core/store/user';
import { SharedModule } from '../../../shared/shared.module';
import { LoginPageComponent } from './login-page.component';

describe('Login Component', () => {
  let fixture: ComponentFixture<LoginPageComponent>;
  let component: LoginPageComponent;
  let element: HTMLElement;
  let store: Store<State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoginPageComponent
      ],
      providers: [
        { provide: USE_SIMPLE_ACCOUNT, useValue: true },
        { provide: USER_REGISTRATION_LOGIN_TYPE, useValue: 'email' },
        FormUtilsService
      ],
      imports: [
        SharedModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([
          { path: 'account', component: LoginPageComponent }
        ]),
        CustomFormsModule,
        StoreModule.forRoot(reducers),
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    store = TestBed.get(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should check if controls are rendered on Login page', () => {
    expect(element.querySelector('input[data-testing-id=userName]')).toBeTruthy();
    expect(element.querySelector('input[data-testing-id=password]')).toBeTruthy();
    expect(element.getElementsByClassName('btn btn-primary')).toBeTruthy();
  });

  it('should not have any error when initialized', () => {
    expect(component.isDirty).toBeFalsy();
    component.loginError$.subscribe(val => expect(val).toBeUndefined());
  });

  describe('error detection', () => {
    beforeEach(() => {
      store.dispatch(new LoginUserFail(new HttpErrorResponse({ status: 401 })));

      const userDetails = { userName: 'intershop@123.com', password: 'wrong' };
      component.onSignin(userDetails);
    });

    it('should set isDirty to true when form is invalid', () => {
      expect(component.isDirty).toBe(true);
    });

    it('should set errorUser when user enters wrong credentials', () => {
      component.loginError$.subscribe(val => expect(val).toBeTruthy());
    });
  });

  it('should not detect error if email is well formed', () => {
    component.loginForm.controls['userName'].setValue('test@test.com');
    expect(component.loginForm.controls['userName'].valid).toBeTruthy();
  });

  it('should detect error if email is malformed', () => {
    component.loginForm.controls['userName'].setValue('testtest.com');
    expect(component.loginForm.controls['userName'].valid).toBeFalsy();
  });
});
