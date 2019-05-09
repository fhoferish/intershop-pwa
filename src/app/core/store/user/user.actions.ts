import { Action } from '@ngrx/store';

import { LoginCredentials } from '../../models/credentials/credentials.model';
import { CustomerRegistrationType, CustomerUserType } from '../../models/customer/customer.model';
import { HttpError } from '../../models/http-error/http-error.model';
import { User } from '../../models/user/user.model';

export enum UserActionTypes {
  LoginUser = '[Account] Login User',
  LoginUserSuccess = '[Account API] Login User Success',
  LoginUserFail = '[Account API] Login User Failed',
  SetAPIToken = '[Account Internal] Set API Token',
  LoadCompanyUser = '[Account Internal] Load Company User',
  LoadCompanyUserFail = '[Account API] Load Company User Fail',
  LoadCompanyUserSuccess = '[Account API] Load Company User Success',
  LogoutUser = '[Account] Logout User',
  CreateUser = '[Account] Create User',
  CreateUserFail = '[Account API] Create User Failed',
  UpdateUser = '[Account] Update User',
  UpdateUserSuccess = '[Account API] Update User Succeeded',
  UpdateUserFail = '[Account API] Update User Failed',
  UserErrorReset = '[Account Internal] Reset User Error',
  LoadUserByAPIToken = '[Account] Load User by API Token',
}

export class LoginUser implements Action {
  readonly type = UserActionTypes.LoginUser;
  constructor(public payload: { credentials: LoginCredentials }) {}
}

export class LoginUserFail implements Action {
  readonly type = UserActionTypes.LoginUserFail;
  constructor(public payload: { error: HttpError }) {}
}

export class LoginUserSuccess implements Action {
  readonly type = UserActionTypes.LoginUserSuccess;
  constructor(public payload: CustomerUserType) {}
}

export class SetAPIToken implements Action {
  readonly type = UserActionTypes.SetAPIToken;
  constructor(public payload: { apiToken: string }) {}
}

export class LoadCompanyUser implements Action {
  readonly type = UserActionTypes.LoadCompanyUser;
}

export class LoadCompanyUserFail implements Action {
  readonly type = UserActionTypes.LoadCompanyUserFail;
  constructor(public payload: { error: HttpError }) {}
}

export class LoadCompanyUserSuccess implements Action {
  readonly type = UserActionTypes.LoadCompanyUserSuccess;
  constructor(public payload: { user: User }) {}
}

export class LogoutUser implements Action {
  readonly type = UserActionTypes.LogoutUser;
}

export class CreateUser implements Action {
  readonly type = UserActionTypes.CreateUser;
  constructor(public payload: CustomerRegistrationType) {}
}

export class CreateUserFail implements Action {
  readonly type = UserActionTypes.CreateUserFail;
  constructor(public payload: { error: HttpError }) {}
}

export class UpdateUser implements Action {
  readonly type = UserActionTypes.UpdateUser;
  constructor(public payload: { user: User }) {}
}

export class UpdateUserSuccess implements Action {
  readonly type = UserActionTypes.UpdateUserSuccess;
  constructor(public payload: { user: User }) {}
}

export class UpdateUserFail implements Action {
  readonly type = UserActionTypes.UpdateUserFail;
  constructor(public payload: { error: HttpError }) {}
}

export class UserErrorReset implements Action {
  readonly type = UserActionTypes.UserErrorReset;
}

export class LoadUserByAPIToken implements Action {
  readonly type = UserActionTypes.LoadUserByAPIToken;
  constructor(public payload: { apiToken: string }) {}
}

export type UserAction =
  | LoginUser
  | LoginUserFail
  | LoginUserSuccess
  | SetAPIToken
  | LoadCompanyUser
  | LoadCompanyUserFail
  | LoadCompanyUserSuccess
  | LogoutUser
  | CreateUser
  | CreateUserFail
  | UpdateUser
  | UpdateUserSuccess
  | UpdateUserFail
  | UserErrorReset
  | LoadUserByAPIToken;
