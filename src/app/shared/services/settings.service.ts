import { Inject, Injectable } from "@angular/core";
import { LOCAL_STORAGE, StorageService } from "./storage.service";

export const SANDBOX_URL = "sandbox_url";
export const SYSTEM_SERVICE_SEGMENT = "/sf/system/";

@Injectable({
  providedIn: "root"
})
export class SettingsService {

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) { }

  get url(): string {
    return this.storage.getItem(SANDBOX_URL);
  }

  get systemServiceUrl(): string {
    return this.url + SYSTEM_SERVICE_SEGMENT;
  }

  set url(url: string) {
    this.storage.setItem(SANDBOX_URL, url);
  }
}
