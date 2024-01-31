import { InjectionToken } from "@angular/core";

class AppUtils {
  public toolbarFunctions: string[] = ['MESSAGING'];
  public limitTabNavigation: number = 4;
  constructor() {}
}

export const APP_UTILS = new InjectionToken<AppUtils>('AppUtils');