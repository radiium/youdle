import { browser, element, by } from 'protractor';

/* tslint:disable */
export class YoudlePage {
  navigateTo(route: string) {
    return browser.get(route);
  }
}
