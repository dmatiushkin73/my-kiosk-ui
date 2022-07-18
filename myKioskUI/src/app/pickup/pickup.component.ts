import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { Form, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PICKUP_CODE_LENGTH, AUTOCLOSE_TIMEOUT } from '../app.constants';
import { KeyboardService } from '../services/keyboard.service';
import { KEYBOARD_LAYOUT } from '../models/keylayouts';
import { Key, KeyType } from '../models/keyboard';
import { PickupOrderItem, PickupService } from '../services/pickup.service';
import { OrderData } from '../models/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WebsocketService } from '../services/websocket.service';
import { DISPENSING_STATUS } from '../models/wsmessage';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-pickup',
  templateUrl: './pickup.component.html',
  styleUrls: ['./pickup.component.scss']
})
export class PickupComponent implements OnInit, OnDestroy {

  private titlePickup = "Enter code to pick up your items";
  private titleValidation = "Validating your code";
  private titleDispensing = "Your order is being dispensed";
  private titleFault = "Warning";
  private titleComplete = "Your order is dispensed";

  title: string;
  enteringCode = true;
  validationInProgress = false;
  validationUnsuccessful = false;
  dispensingInProgress = false;
  dispensingComplete = false;
  validationResult = "";
  order?: PickupOrderItem[];
  dispensingStatus = "";
  pickUpCode: FormControl;

  constructor(private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<PickupComponent>,
    private keyboardService: KeyboardService,
    private pickupService: PickupService,
    private snackBar: MatSnackBar,
    private wsService: WebsocketService,
    private sessionService: SessionService) {
      iconRegistry.addSvgIcon('close', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/close.svg'));
      iconRegistry.addSvgIcon('ok', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/check.svg'));
      iconRegistry.addSvgIcon('retry', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/retry.svg'));
      iconRegistry.addSvgIcon('success', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/sign-check.svg'));
      iconRegistry.addSvgIcon('warning', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/sign-warning.svg'));
      this.pickUpCode = new FormControl('', [Validators.required,
                                             Validators.minLength(PICKUP_CODE_LENGTH),
                                             Validators.maxLength(PICKUP_CODE_LENGTH)]);
      this.title = this.titlePickup;
    }

  ngOnInit(): void {
    this.keyboardService.switchLayout(KEYBOARD_LAYOUT.NUMS_AND_CAPS);
    setTimeout(() => {
      this.keyboardService.showKeyboard();
    }, 300);

    this.keyboardService.watchKeyPressed()
    .subscribe({
      next: (v) => {
        var currCode: string = this.pickUpCode.value;
        if (v.getType() == KeyType.KEY_BS) {
          if (currCode.length > 0) {
            currCode = currCode.slice(0, currCode.length-1);
            this.pickUpCode.setValue(currCode);  
          }
        }
        else if (currCode.length < PICKUP_CODE_LENGTH) {
          currCode = currCode + v.getValue(true);
          this.pickUpCode.setValue(currCode);
        }
      }
    });

    this.wsService.watchDispensingStatus()
    .subscribe({
      next: (msg) => {
        if (this.dispensingInProgress && this.order && msg.eventType) {
          if (msg.eventType == DISPENSING_STATUS.DISPENSING_STARTED) {
            this.dispensingStatus = "Dispensing is in progress...";
          }
          else if (msg.eventType == DISPENSING_STATUS.DISPENSED_ONE_ITEM) {
            for (var i = 0; i < this.order.length; i++) {
              if (this.order[i].variantId == msg.variantId && msg.status) {
                this.order[i].dispensed++;
                if (this.order[i].dispensed >= this.order[i].amount) {
                  this.order[i].complete = true;
                  this.order[i].success = true;
                }
              }
            }
          }
          else if (msg.eventType == DISPENSING_STATUS.WAIT_FOR_PICKUP) {
            this.dispensingStatus = "Please pick up your item(s).";
          }
          else if (msg.eventType == DISPENSING_STATUS.DISPENSED_ALL_ITEMS) {
            var successful = true;
            for (var i = 0; i < this.order.length; i++) {
              if (!this.order[i].complete) {
                this.order[i].complete = true;
                this.order[i].success = false;
                successful = false;
              }
            }
            if (successful) {
              this.dispensingStatus = "Dispensing successfully completed. Thank you for your purchase!";
            }
            else {
              this.dispensingStatus = "Dispensing completed with error(s). Please contact customer service."
            }
            this.dispensingInProgress = false;
            this.dispensingComplete = true;
            this.title = this.titleComplete;
            this.sessionService.startSession();
            setTimeout(() => {
              this.dialogRef.close();
            }, AUTOCLOSE_TIMEOUT*1000);
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.keyboardService.hideKeyboard();
    this.dialogRef.close();
  }

  onOkClick() {
    this.enteringCode = false;
    this.validationInProgress = true;
    this.keyboardService.hideKeyboard();
    this.title = this.titleValidation;
    this.pickupService.requestPickup(this.pickUpCode.value)
    .then((v) => {
      if (v.status == "OK") {
        this.order = [];
        for (const od of v.order) {
          this.order.push(od);
        }
        this.validationInProgress = false;
        this.dispensingInProgress = true;
        this.title = this.titleDispensing;
        this.sessionService.stopSession();
      }
      else {
        this.validationResult = v.status;
        this.validationInProgress = false;
        this.validationUnsuccessful = true;
        this.title = this.titleFault;
      }
    })
    .catch(() => {
      this.validationInProgress = false;
      this.validationUnsuccessful = true;
      this.title = this.titleFault;
      this.snackBar.open(this.pickupService.getLastErrMsg(), undefined, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2000,
        panelClass: 'errmsg-panel'
      });
    })
  }

  onRetryClick() {
    this.title = this.titlePickup;
    this.validationUnsuccessful = false;
    this.enteringCode = true;
    this.pickUpCode.reset();
    this.pickUpCode.setValue("");
    this.keyboardService.showKeyboard();
  }

  getErrorMessage() {
    if (this.pickUpCode.hasError('required')) {
      return 'You must enter a value';
    }
    else if (this.pickUpCode.hasError('minlength') || this.pickUpCode.hasError('maxlength')) {
      return `Your code must have ${PICKUP_CODE_LENGTH} symbols`;
    }
    return '';
  }
}
