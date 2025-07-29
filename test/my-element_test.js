import { fixture, html, expect } from '@open-wc/testing';
import '../my-element.js';

describe('<my-element>', () => {
  it('renders a heading', async () => {
    const el = await fixture(html`<my-element></my-element>`);
    const h1 = el.shadowRoot.querySelector('h1');
    expect(h1).to.exist;
    expect(h1.textContent.toLowerCase()).to.include('hello');
  });
});