// time in sec
export const INACTIVITY_TIME = 90;
export const TRANSACTION_LIFE_TIME = 60;
export const AUTOCLOSE_TIMEOUT = 15;

export const PICKUP_CODE_LENGTH = 6;

export enum RESPONSE {
  OK = 'OK',
  NOK = 'NOK',
}

export enum PICKUP_STATUS {
  OK = 'OK', 
  NOK = 'NOK',
  PENDING = 'PENDING',
  NOT_FOUND = 'NOT FOUND',
  EXPIRED = 'EXPIRED',
  FULFILLED = 'FULFILLED'
}

export const KEEPALIVE_INTERVAL = 10;
export const KEEPALIVE_TIMEOUT = 10; // in 2 sec intervals, i.e. 20 seconds

export const DISPLAY_ID = 'displayId';

export enum UI_MODE {
  INITIALIZATION = 0,
  VENDING = 1,
  MAINTENANCE = 2
}

export enum PAYMENT_METHOD {
  QR_CODE = 0,
  CREDIT_CARD = 1
}

export const CART_DLG_SIZES = {
  width: "70vw", 
  minHeight: "25vh",
  maxHeight: "80vh"
}
