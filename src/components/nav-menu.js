import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { setLocale, t, getLocale } from '../localization.js';

class NavMenu extends LitElement {
  static properties = {
    currentLocale: { type: String },
    activePath:    { type: String }
  };

  static styles = css`
    #header {
      display: flex;
      justify-content: space-between;
      padding: 8px;
      margin-bottom: 8px;
    }
    .top-left {
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 10px;;
    }
    .header-logo {
      width: 25px;
      height: 25px;
    }
    .header-span {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      text-transform: uppercase;
    }
    .top-right {
      display: flex;
      align-items: center;
    }
    nav {
      display: flex;
      gap: 1rem;
      font-size: 1.1em;
    }
    nav a {
      color: var(--app-color-brand);
      text-decoration: none;
      font-size: 13px;
      font-weight: 400;
      opacity: .7;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    a.active {
      opacity: 1;
    }
    nav a img {
      width: 20px;
    }
    .header-lang {
      width: 25px;
      cursor: pointer;
      margin-left: 10px;
    }
  `;

  constructor() {
    super();
    this.currentLocale = getLocale();
    this.activePath = window.location.pathname;
    this._onLocationChanged = this._onLocationChanged.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener(
      'vaadin-router-location-changed',
      this._onLocationChanged
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(
      'vaadin-router-location-changed',
      this._onLocationChanged
    );
  }

  _onLocationChanged(e) {
    this.activePath = e.detail.location.pathname;
  }

  render() {
    const links = [
      { href: '/list', label: t('navEmployees'), src: './public/images/employeeList.png' },
      { href: '/add',  label: t('navAddNew'), src: './public/images/employeeAdd.png' }
    ];
    const path = window.location.pathname;
    return html`
    <div id="header">
      <a href="/list" class="top-left">
        <img class="header-logo" src="./public/images/ing.png" alt="ING Logo" title="ING Logo">
        <span class="header-span">ING</span>
      </a>
      <div class="top-right">
        <nav>
          ${links.map(link => {
            const classes = { active: this.activePath === link.href };
            return html`
              <a href="${link.href}" class="${classMap(classes)}"><img src="${link.src}" alt="${link.label}" title="${link.label}">${link.label}</a>
            `;
          })}
        </nav>
        
        <img class="header-lang" src="${t('navLang')}" .value=${t('navLangValue')} @click=${this._onLocaleChange} alt="Language Icon" title="Change Language">
      </div>
    </div>
    `;
  }

  _onLocaleChange(e) {
    const locale = e.target.value;
    this.currentLocale = locale;
    setLocale(locale);
    this.requestUpdate();
  }
}
customElements.define('nav-menu', NavMenu);