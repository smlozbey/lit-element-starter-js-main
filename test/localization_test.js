import { expect } from '@open-wc/testing';
import {
  t,
  getLocale,
  setLocale,
  localeChangedEventName
} from '../src/localization.js';

describe('localization.js', () => {
  beforeEach(() => {
    setLocale('en');
  });

  it('returns default locale as en', () => {
    expect(getLocale()).to.equal('en');
  });

  it('translates key in default (en) locale', () => {
    expect(t('navEmployees')).to.equal('Employees');
    expect(t('cancel')).to.equal('Cancel');
  });

  it('returns key itself if translation not found', () => {
    expect(t('nonExistingKey')).to.equal('nonExistingKey');
  });

  it('translates key in Turkish after locale change', () => {
    setLocale('tr');
    expect(getLocale()).to.equal('tr');
    expect(t('navEmployees')).to.equal('Çalışanlar');
    expect(t('cancel')).to.equal('İptal');
  });

  it('dispatches locale-changed event on setLocale()', (done) => {
    window.addEventListener(localeChangedEventName, () => {
      expect(getLocale()).to.equal('tr');
      done();
    });
    setLocale('tr');
  });
});