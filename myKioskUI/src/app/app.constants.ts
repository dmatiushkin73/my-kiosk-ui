// time in sec
export const INACTIVITY_TIME = 90;
export const TRANSACTION_LIFE_TIME = 60;
export const INACTIVITY_CONFIRM_TIME = 10;

export const PICKUP_CODE_LENGTH = 6;

export enum DISPENSING_STATUS {
  DISPENSING_STARTED = 'dispensing_started',
  DISPENSED_ONE_ITEM = 'dispensed_one_item',
  WAIT_FOR_PICKUP = 'wait_for_pickup',
  DISPENSED_ALL_ITEMS = 'dispensed_all_items',
}

export enum MACHINE_STATUS {
  AVAILABLE = 'available',     // machine is available for any operation
  BUSY = 'busy',               // machine is unavailable for new dispensing requests
  UNAVAILABLE = 'unavailable', // machine is unavailable for users
  ERROR = 'error',             // machine is not usable at all
  SWUPDATE = 'sw-update',      // software update was requested and machine is about to execute update procedure
}

export enum RESPONSE {
  OK = 'OK',
  NOK = 'NOK',
}

export const HEARTBEAT_TIMEOUT_MS = 60000;
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
