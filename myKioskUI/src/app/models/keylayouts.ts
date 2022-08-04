import { KeyType, KeyLayoutTemplate } from './keyboard';

export enum KEYBOARD_LAYOUT {
    ONLY_NUMS,
    NUMS_AND_CAPS,
    FULL_SIMPLE
}

export const ONLY_NUMS_LAYOUT: KeyLayoutTemplate = [
    [
      {type: KeyType.KEY_NUM, value: '1', altValue: '1', classname: 'keyN'},
      {type: KeyType.KEY_NUM, value: '2', altValue: '2', classname: 'keyN'},
      {type: KeyType.KEY_NUM, value: '3', altValue: '3', classname: 'keyN'},
      {type: KeyType.KEY_NUM, value: '4', altValue: '4', classname: 'keyN'},
      {type: KeyType.KEY_NUM, value: '5', altValue: '5', classname: 'keyN'},
      {type: KeyType.KEY_NUM, value: '6', altValue: '6', classname: 'keyN'},
      {type: KeyType.KEY_NUM, value: '7', altValue: '7', classname: 'keyN'},
      {type: KeyType.KEY_NUM, value: '8', altValue: '8', classname: 'keyN'},
      {type: KeyType.KEY_NUM, value: '9', altValue: '9', classname: 'keyN'},
      {type: KeyType.KEY_NUM, value: '0', altValue: '0', classname: 'keyN'},
      {type: KeyType.KEY_BS, value: 'bs', altValue: 'bs', classname: 'keyC'}
    ]
  ];

  export const NUMS_CAPS_LAYOUT: KeyLayoutTemplate = [
    [
      {type: KeyType.KEY_NUM, value: '1', altValue: '1', classname: 'keyN'},
      {type: KeyType.KEY_NUM, value: '2', altValue: '2', classname: 'keyN'},
      {type: KeyType.KEY_NUM, value: '3', altValue: '3', classname: 'keyN'},
      {type: KeyType.KEY_NUM, value: '4', altValue: '4', classname: 'keyN'},
      {type: KeyType.KEY_NUM, value: '5', altValue: '5', classname: 'keyN'},
      {type: KeyType.KEY_NUM, value: '6', altValue: '6', classname: 'keyN'},
      {type: KeyType.KEY_NUM, value: '7', altValue: '7', classname: 'keyN'},
      {type: KeyType.KEY_NUM, value: '8', altValue: '8', classname: 'keyN'},
      {type: KeyType.KEY_NUM, value: '9', altValue: '9', classname: 'keyN'},
      {type: KeyType.KEY_NUM, value: '0', altValue: '0', classname: 'keyN'},
      {type: KeyType.KEY_BS, value: 'bs', altValue: 'bs', classname: 'keyC'}
    ],
    [
      {type: KeyType.KEY_LETTER, value: 'Q', altValue: 'Q', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'W', altValue: 'W', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'E', altValue: 'E', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'R', altValue: 'R', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'T', altValue: 'T', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'Y', altValue: 'Y', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'U', altValue: 'U', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'I', altValue: 'I', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'O', altValue: 'O', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'P', altValue: 'P', classname: 'keyL'}
    ],
    [
      {type: KeyType.KEY_LETTER, value: 'A', altValue: 'A', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'S', altValue: 'S', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'D', altValue: 'D', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'F', altValue: 'F', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'G', altValue: 'G', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'H', altValue: 'H', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'J', altValue: 'J', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'K', altValue: 'K', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'L', altValue: 'L', classname: 'keyL'}
    ],
    [
      {type: KeyType.KEY_LETTER, value: 'Z', altValue: 'Z', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'X', altValue: 'X', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'C', altValue: 'C', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'V', altValue: 'V', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'B', altValue: 'B', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'N', altValue: 'N', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'M', altValue: 'M', classname: 'keyL'}
    ]
  ];

  export const FULL_SIMPLE_LAYOUT: KeyLayoutTemplate = [
    [
      {type: KeyType.KEY_NUM, value: '1', altValue: '1', classname: 'keyN'},
      {type: KeyType.KEY_NUM, value: '2', altValue: '2', classname: 'keyN'},
      {type: KeyType.KEY_NUM, value: '3', altValue: '3', classname: 'keyN'},
      {type: KeyType.KEY_NUM, value: '4', altValue: '4', classname: 'keyN'},
      {type: KeyType.KEY_NUM, value: '5', altValue: '5', classname: 'keyN'},
      {type: KeyType.KEY_NUM, value: '6', altValue: '6', classname: 'keyN'},
      {type: KeyType.KEY_NUM, value: '7', altValue: '7', classname: 'keyN'},
      {type: KeyType.KEY_NUM, value: '8', altValue: '8', classname: 'keyN'},
      {type: KeyType.KEY_NUM, value: '9', altValue: '9', classname: 'keyN'},
      {type: KeyType.KEY_NUM, value: '0', altValue: '0', classname: 'keyN'},
      {type: KeyType.KEY_BS, value: 'bs', altValue: 'bs', classname: 'keyC'}
    ],
    [
      {type: KeyType.KEY_LETTER, value: 'q', altValue: 'Q', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'w', altValue: 'W', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'e', altValue: 'E', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'r', altValue: 'R', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 't', altValue: 'T', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'y', altValue: 'Y', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'u', altValue: 'U', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'i', altValue: 'I', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'o', altValue: 'O', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'p', altValue: 'P', classname: 'keyL'}
    ],
    [
      {type: KeyType.KEY_CAPS, value: 'caps lock', altValue: 'caps lock', classname: 'keyC'},
      {type: KeyType.KEY_LETTER, value: 'a', altValue: 'A', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 's', altValue: 'S', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'd', altValue: 'D', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'f', altValue: 'F', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'g', altValue: 'G', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'h', altValue: 'H', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'j', altValue: 'J', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'k', altValue: 'K', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'l', altValue: 'L', classname: 'keyL'}
    ],
    [
      {type: KeyType.KEY_LETTER, value: 'z', altValue: 'Z', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'x', altValue: 'X', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'c', altValue: 'C', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'v', altValue: 'V', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'b', altValue: 'B', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'n', altValue: 'N', classname: 'keyL'},
      {type: KeyType.KEY_LETTER, value: 'm', altValue: 'M', classname: 'keyL'}
    ]
  ];