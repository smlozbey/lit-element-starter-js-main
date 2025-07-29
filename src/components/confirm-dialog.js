import { LitElement, html, css } from 'lit';
import { t, localeChangedEventName } from '../localization.js';

export class ConfirmDialog extends LitElement {
  static properties = {
    open: { type: Boolean },
    message: { type: String },
    title: { type: String },
    onConfirm: { type: Function },
    onCancel: { type: Function },
  };

  static styles = css`
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .dialog {
      position: relative;
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 0 10px 10px rgba(0,0,0,0.2);
      max-width: 400px;
      width: 90%;
    }
    .dialog img {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 24px;
      cursor: pointer;
    }
    .dialog span {
        font-size: 1.5em;
        font-weight: 600;
        color: var(--app-color-brand);
    }
    .buttons {
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 1rem;
    }
    button {
      padding: 0.6rem 1.2rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
    }
    .cancel {
        border: 1px solid rgb(82, 80, 153);
        background-color: unset;
        color: rgb(82, 80, 153);
    }
    .confirm {
      background-color: var(--app-color-brand, #FF6200);
      color: white;
    }
  `;

  constructor() {
    super();
    this.open = false;
    this.message = '';
    this.title = '';
    this.onConfirm = () => {};
    this.onCancel = () => {};
  }

  render() {
    if (!this.open) return html``;

    return html`
      <div class="backdrop">
        <div class="dialog">
          <img src="./public/images/close.png" alt="${t('close')}" title="${t('close')}" @click=${this._handleCancel}>
          <span>${this.title}</span>
          <p>${this.message}</p>
          <div class="buttons">
            <button class="confirm" @click=${this._handleConfirm}>${t('proceed')}</button>
            <button class="cancel" @click=${this._handleCancel}>${t('cancel')}</button>
          </div>
        </div>
      </div>
    `;
  }

  _handleConfirm() {
    this.open = false;
    this.onConfirm?.();
  }

  _handleCancel() {
    this.open = false;
    this.onCancel?.();
  }
}

customElements.define('confirm-dialog', ConfirmDialog);