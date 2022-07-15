export enum KeyType {
    KEY_NUM,
    KEY_LETTER,
    KEY_BS,
    KEY_CAPS
}

export interface IKey {
    type: KeyType;
    value: string;
    altValue: string;
    classname: string;
}

export class Key {
    private type: KeyType;
    private value: string;
    private altValue: string;
    private classname: string;
   
    constructor(k: IKey) {
        this.type = k.type;
        this.value = k.value;
        this.altValue = k.altValue;
        this.classname = k.classname;
    }

    public getType(): KeyType {
        return this.type;
    }

    public getValue(capsOn: boolean): string {
        if (capsOn) {
            return this.altValue;
        }
        else {
            return this.value;
        }
    }

    public getClassName(): string {
        return this.classname;
    }

    public useIcon() {
        if (this.type == KeyType.KEY_BS) {
            return true;
        }
        else {
            return false;
        }
    }
}

export type IKeyRow = IKey[]
export type KeyLayoutTemplate = IKeyRow[];
export type KeyRow = Key[]
export type KeyLayout = KeyRow[];

export class KeyLayoutManager {
    private layout: KeyLayout;
    private capsOn: boolean;

    constructor(layoutTemplate: KeyLayoutTemplate) {
        this.layout = [];
        for (var row of layoutTemplate) {
            var keyRow: KeyRow = [];
            for (var ikey of row) {
                keyRow.push(new Key(ikey));
            }
            this.layout.push(keyRow);
        }
        this.capsOn = false;
    }

    public getKeys(): KeyLayout {
        return this.layout;
    }

    public onKeyPressed(key: Key) {
        if (key.getType() == KeyType.KEY_CAPS) {
            this.capsOn = !this.capsOn;
        }
    }

    public isCapsOn(): boolean {
        return this.capsOn;
    }
}