import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { Form, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PICKUP_CODE_LENGTH } from '../app.constants';
import { KeyboardService } from '../services/keyboard.service';
import { KEYBOARD_LAYOUT } from '../models/keylayouts';
import { Key, KeyType } from '../models/keyboard';
import { PickupOrderInfo, PickupService } from '../services/pickup.service';
import { OrderData } from '../models/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  title: string;
  enteringCode = true;
  validationInProgress = false;
  validationUnsuccessful = false;
  dispensingInProgress = false;
  dispensingComplete = false;
  validationResult = "";
  order?: OrderData[];
  pickUpCode: FormControl;

  constructor(private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<PickupComponent>,
    private keyboardService: KeyboardService,
    private pickupService: PickupService,
    private snackBar: MatSnackBar) {
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
