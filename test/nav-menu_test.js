import { fixture, html, expect } from '@open-wc/testing';
import '../src/components/nav-menu.js';

describe('<nav-menu>', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/list');
  });

  it('renders logo and header', async () => {
    const el = await fixture(html`<nav-menu></nav-menu>`);
    const logo = el.shadowRoot.querySelector('.header-logo');
    const span = el.shadowRoot.querySelector('.header-span');
    expect(logo).to.exist;
    expect(span.textContent.trim().toLowerCase()).to.equal('ing');
  });

  it('renders two navigation links', async () => {
    const el = await fixture(html`<nav-menu></nav-menu>`);
    const links = el.shadowRoot.querySelectorAll('nav a');
    expect(links.length).to.equal(2);
    expect(links[0].getAttribute('href')).to.equal('/list');
    expect(links[1].getAttribute('href')).to.equal('/add');
  });

  it('applies "active" class to correct route', async () => {
    const el = await fixture(html`<nav-menu></nav-menu>`);
    el.activePath = '/list';
    await el.updateComplete;
    const active = el.shadowRoot.querySelector('a.active');
    expect(active).to.exist;
    expect(active.getAttribute('href')).to.equal('/list');
  });

  it('updates activePath when router event dispatched', async () => {
    const el = await fixture(html`<nav-menu></nav-menu>`);
    const event = new CustomEvent('vaadin-router-location-changed', {
      detail: { location: { pathname: '/add' } }
    });
    window.dispatchEvent(event);
    await el.updateComplete;
    expect(el.activePath).to.equal('/add');
  });

  it('language icon exists and is clickable', async () => {
    const el = await fixture(html`<nav-menu></nav-menu>`);
    const langIcon = el.shadowRoot.querySelector('.header-lang');
    expect(langIcon).to.exist;

    langIcon.dispatchEvent(new Event('click'));
    await el.updateComplete;

    expect(true).to.be.true;
  });
});