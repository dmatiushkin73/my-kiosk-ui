import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalsService } from './globals.service';
import { handleHttpError } from '../shared/utils';
import { environment } from 'src/environments/environment';
import { PickupResponse, OrderData } from '../models/interfaces';
import { PICKUP_STATUS } from '../app.constants';
import { Observable, of, delay } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { DISPENSING_STATUS, WsMessage, WsMsgType } from '../models/wsmessage';

export interface PickupOrderItem {
  variantId: number;
  name: string;
  image: string;
  amount: number;
  dispensed: number;
  complete: boolean;
  success: boolean;
}

export class PickupOrderInfo {
  status: string;
  order: PickupOrderItem[];

  constructor() {
    this.status = "";
    this.order = [];
  }
}

@Injectable({
  providedIn: 'root'
})
export class PickupService {

  private pickupApi = '/pickup';

  private lastErrorMsg = "";

  constructor(private http: HttpClient,
    private globalsService: GlobalsService,
    private wsService: WebsocketService) { }

  private doRequestPickup(code: string): Observable<PickupResponse> {
    if (environment.simulation) {
      this.wsService.simulateSequence([
        {
          messageType: WsMsgType.DISPENSING_STATUS,
          eventType: DISPENSING_STATUS.DISPENSING_STARTED
        },
        {
          messageType: WsMsgType.DISPENSING_STATUS,
          eventType: DISPENSING_STATUS.DISPENSED_ONE_ITEM,
          variantId: 6000000000016,
          status: true
        },
        {
          messageType: WsMsgType.DISPENSING_STATUS,
          eventType: DISPENSING_STATUS.DISPENSED_ONE_ITEM,
          variantId: 6000000000023,
          status: true
        },
        {
          messageType: WsMsgType.DISPENSING_STATUS,
          eventType: DISPENSING_STATUS.WAIT_FOR_PICKUP
        },
        {
          messageType: WsMsgType.DISPENSING_STATUS,
          eventType: DISPENSING_STATUS.DISPENSING_STARTED
        },
        {
          messageType: WsMsgType.DISPENSING_STATUS,
          eventType: DISPENSING_STATUS.DISPENSED_ONE_ITEM,
          variantId: 6000000000016,
          status: true
        },
        {
          messageType: WsMsgType.DISPENSING_STATUS,
          eventType: DISPENSING_STATUS.WAIT_FOR_PICKUP
        },
        {
          messageType: WsMsgType.DISPENSING_STATUS,
          eventType: DISPENSING_STATUS.DISPENSED_ALL_ITEMS
        }
      ]);
      return of({
        status: PICKUP_STATUS.OK,
        order: [
          {
            variantId: 6000000000023,
            name: "Dark Chocolate Covered Almonds",
            image: "/assets/images/4891010990169.png",
            amount: 1
          },
          {
            variantId: 6000000000016,
            name: "Masterpieces Milk Chocolate Caramel Lion",
            image: "/assets/images/4899046850649.png",
            amount: 2
          }
        ]
      }).pipe(delay(1000));
    }
    else {
      return this.http.post<PickupResponse>(`${environment.restServerUrl}${this.pickupApi}`, code,
                                            this.globalsService.getHttpWriteOptions());
    }
  }

  requestPickup(code: string): Promise<PickupOrderInfo> {
    return new Promise<PickupOrderInfo>((resolve, reject) => {
      this.doRequestPickup(code)
      .subscribe({
        next: (v) => {
          var orderInfo = new PickupOrderInfo();
          if (v.status == PICKUP_STATUS.OK || v.status == PICKUP_STATUS.PENDING) {
            orderInfo.status = "OK";
            if (v.order) {
              for (const orderData of v.order) {
                orderInfo.order.push({
                  variantId: orderData.variantId,
                  name: orderData.name,
                  image: orderData.image,
                  amount: orderData.amount,
                  dispensed: 0,
                  complete: false,
                  success: false
                });
              }
            }
          }
          else if (v.status == PICKUP_STATUS.NOT_FOUND) {
            orderInfo.status = "Entered code is incorrect!";
          }
          else if (v.status == PICKUP_STATUS.EXPIRED) {
            orderInfo.status = "Your order has expired. Please contact customer support for more information.";
          }
          else if (v.status == PICKUP_STATUS.FULFILLED) {
            orderInfo.status = "Order with this code is already picked up!";
          }
          else {
            orderInfo.status = "Something went wrong. Try again later.";
          }
          resolve(orderInfo);
        },
        error: (err) => {
          console.log(handleHttpError("request", "pickup for code " + code, err));
          this.lastErrorMsg = "Failed to request pickup operation";
          reject();
        }
      });
    });
  }

  getLastErrMsg(): string {
    return this.lastErrorMsg;
  }
}
