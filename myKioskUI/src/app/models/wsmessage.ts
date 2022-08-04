export enum WsMsgType {
    HUMAN_DETECTED = "humanDetected",
    BRAND_INFO_UPDATED = "brandInfoUpdated",
    UI_MODEL_UPDATED = "uiModelUpdated",
    DISPENSING_STATUS = "dispensingStatus",
    MACHINE_STATUS = "machineStatus"
}

export interface WsMessage {
    messageType: string;
    profileId?: number;
    eventType?: string;
    status?: boolean | string;
    variantId?: number;
}

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
    TIMEOUT = "timeout"          // internal status, can't come from Websocket, means keepalive timeout expired
  }