import {Injectable, InjectionToken} from "@angular/core";

export const LOCAL_STORAGE = new InjectionToken("LocalStorage");

@Injectable({
  providedIn: "root"
})
export class StorageService {
  constructor(private storage: Storage) { }

  getItem(key: string): string {
    let item;
    if (this.storage) {
     item =  this.storage.getItem(key);
    }
    return item;
  }

  setItem(key: string, data: string) {
    if (this.storage) {
      this.storage.setItem(key, data);
    }
  }

  removeItem(key: string) {
    if (this.storage) {
      this.storage.removeItem(key);
    }
  }
}
