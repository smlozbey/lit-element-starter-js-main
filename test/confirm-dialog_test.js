import { fixture, html, expect } from '@open-wc/testing';
import '../src/components/confirm-dialog.js';

describe('<confirm-dialog>', () => {
  it('renders nothing when not open', async () => {
    const el = await fixture(html`
      <confirm-dialog .open=${false}></confirm-dialog>
    `);
    const dialog = el.shadowRoot.querySelector('.dialog');
    expect(dialog).to.not.exist;
  });

  it('renders title and message when open', async () => {
    const el = await fixture(html`
      <confirm-dialog
      .open=${true}
      .title=${'Test Title'}
      .message=${'Test Message'}
    ></confirm-dialog>
    `);
    await el.updateComplete;

    const titleSpan = el.shadowRoot.querySelector('span');
    const messageP = el.shadowRoot.querySelector('p');

    expect(titleSpan).to.exist;
    expect(titleSpan.textContent.trim()).to.equal('Test Title');

    expect(messageP).to.exist;
    expect(messageP.textContent.trim()).to.equal('Test Message');
  });

  it('calls onConfirm and closes dialog when confirm button is clicked', async () => {
    let confirmed = false;
    const el = await fixture(html`
      <confirm-dialog
        .open=${true}
        .onConfirm=${() => { confirmed = true; }}
      ></confirm-dialog>
    `);

    const confirmBtn = el.shadowRoot.querySelector('button.confirm');
    confirmBtn.click();
    await el.updateComplete;

    expect(confirmed).to.be.true;
    expect(el.open).to.be.false;
  });

  it('calls onCancel and closes dialog when cancel button is clicked', async () => {
    let canceled = false;
    const el = await fixture(html`
      <confirm-dialog
        .open=${true}
        .onCancel=${() => { canceled = true; }}
      ></confirm-dialog>
    `);

    const cancelBtn = el.shadowRoot.querySelector('button.cancel');
    cancelBtn.click();
    await el.updateComplete;

    expect(canceled).to.be.true;
    expect(el.open).to.be.false;
  });

  it('calls onCancel and closes dialog when close icon is clicked', async () => {
    let canceled = false;
    const el = await fixture(html`
      <confirm-dialog
        .open=${true}
        .onCancel=${() => { canceled = true; }}
      ></confirm-dialog>
    `);

    const closeBtn = el.shadowRoot.querySelector('img');
    closeBtn.click();
    await el.updateComplete;

    expect(canceled).to.be.true;
    expect(el.open).to.be.false;
  });
});