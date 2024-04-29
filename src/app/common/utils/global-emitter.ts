import {EventEmitter} from "@angular/core";

export class GlobalEmitter {
  private static EMITTERS: { [ID: string]: EventEmitter<any> } = {};

  public static of<T>(ID: string): EventEmitter<T> {
    if (!this.EMITTERS[ID]) {
      this.EMITTERS[ID] = new EventEmitter<T>();
    }

    return this.EMITTERS[ID] as EventEmitter<T>;
  }

  public static reset(): void {
    this.EMITTERS = {};
  }

  public static remove(ID: string) {
    if (!this.EMITTERS[ID]) {
      return;
    }

    this.EMITTERS[ID].complete();
    delete this.EMITTERS[ID];
  }

  static get emitters(): { [p: string]: EventEmitter<any> } {
    return this.EMITTERS;
  }
}
