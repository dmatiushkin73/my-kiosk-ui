import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { KeyType, Key, KeyLayoutTemplate, KeyLayout, KeyLayoutManager } from '../models/keyboard';
import { KEYBOARD_LAYOUT, NUMS_CAPS_LAYOUT } from '../models/keylayouts';
import { KeyboardService } from '../services/keyboard.service';
import { flyInOut } from '../app.animation';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss'],
  animations: [
    flyInOut()
  ]
})
export class KeyboardComponent implements OnInit {

  layoutManager?: KeyLayoutManager;
  numsCapsLayoutManager: KeyLayoutManager;
  isVisible = false;

  constructor(private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private keyboardService: KeyboardService) {
    iconRegistry.addSvgIcon('bs', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/bs.svg'));
    this.numsCapsLayoutManager = new KeyLayoutManager(NUMS_CAPS_LAYOUT);
  }

  ngOnInit(): void {
    this.keyboardService.watchLayoutSwitching()
    .subscribe({
      next: (v) => {
        if (v == KEYBOARD_LAYOUT.ONLY_NUMS) {
          // Not used at the moment
        }
        else if (v == KEYBOARD_LAYOUT.NUMS_AND_CAPS) {
          this.layoutManager = this.numsCapsLayoutManager;
        }
        else if (v == KEYBOARD_LAYOUT.FULL_SIMPLE) {
          // Not used at the moment
        }
      }
    });
    this.keyboardService.watchKeyBoardVisibility()
    .subscribe({
      next: (v) => {
        this.isVisible = v;
      }
    });
  }

  onKeyClicked(key: Key) {
    if (this.layoutManager) {
      this.layoutManager.onKeyPressed(key);
    }
    if (key.getType() != KeyType.KEY_CAPS) {
      this.keyboardService.onKeyPressed(key);
    }
  }
}
