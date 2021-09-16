import {Inject, Injectable} from '@angular/core';
import { PathLocationStrategy } from '@angular/common';
import { WINDOW_TOKEN } from '../common.constants';

const FORWARD_SLASH = "/";

@Injectable({
  providedIn: "root"
})
export class UrlService {

  constructor(private locationStrategy: PathLocationStrategy, @Inject(WINDOW_TOKEN) private window: Window) { }

  public getAbsoluteUrl(urlPath: string): string {
    const baseUrl = this.locationStrategy.getBaseHref();
    const trimmedUrlPath = this.trimForwardSlash(urlPath);

    let result = this.window.location.origin;

    if (baseUrl !== FORWARD_SLASH) {
      result = result + baseUrl;
    }

    if (trimmedUrlPath.length === 0) {
      return result;
    }

    if (!result.endsWith(FORWARD_SLASH)) {
      result = result + FORWARD_SLASH;
    }

    result = result + trimmedUrlPath;

    return result;
  }

  private trimForwardSlash(path: string): string {
    let result = path;

    while (result.startsWith(FORWARD_SLASH)) {
      result = result.substring(FORWARD_SLASH.length);
    }

    while (result.endsWith(FORWARD_SLASH)) {
      result = result.substring(0, result.length - FORWARD_SLASH.length);
    }

    return result;
  }
}
