import { YoudlePage } from './app.po';
import { browser, element, by } from 'protractor';

describe('youdle App', () => {
  let page: YoudlePage;

  beforeEach(() => {
    page = new YoudlePage();
  });

  it('should display message saying App works !', () => {
    page.navigateTo('/');
    expect(element(by.css('app-home h1')).getText()).toMatch('App works !');
  });
});
