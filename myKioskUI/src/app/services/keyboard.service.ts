import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Key } from '../models/keyboard';
import { KEYBOARD_LAYOUT } from '../models/keylayouts';

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {

  private visibility$: Subject<boolean>;
  private keyPressed$: Subject<Key>;
  private layoutChanged$: Subject<KEYBOARD_LAYOUT>;

  constructor() {
    this.visibility$ = new Subject<boolean>();
    this.keyPressed$ = new Subject<Key>();
    this.layoutChanged$ = new Subject<KEYBOARD_LAYOUT>();
  }

  showKeyboard() {
    this.visibility$.next(true);
  }

  hideKeyboard() {
    this.visibility$.next(false);
  }

  watchKeyBoardVisibility(): Subject<boolean> {
    return this.visibility$;
  }

  onKeyPressed(key: Key) {
    this.keyPressed$.next(key);
  }

  watchKeyPressed(): Subject<Key> {
    return this.keyPressed$;
  }

  switchLayout(kl: KEYBOARD_LAYOUT) {
    this.layoutChanged$.next(kl);
  }

  watchLayoutSwitching(): Subject<KEYBOARD_LAYOUT> {
    return this.layoutChanged$;
  }
}
