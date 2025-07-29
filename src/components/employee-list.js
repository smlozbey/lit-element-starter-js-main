import { LitElement, html, css } from 'lit';
import { getEmployees, deleteEmployee } from '../store.js';
import { t, localeChangedEventName } from '../localization.js';
import { sharedStyles } from '../styles/shared-styles.js';
import '/src/components/confirm-dialog.js';

export class EmployeeList extends LitElement {
  static properties = {
    viewMode: { type: String },   // 'list' or 'card'
    employees: { state: true },
    search: { state: true },
    page: { type: Number },     // current page number
    confirmDialogOpen: { type: Boolean },
    employeeToDelete: { type: Object }
  };

  static styles = [
    sharedStyles,
    css`
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;
      }
      .title {
        font-size: 1.5em;
        font-weight: bold;
        color: var(--app-color-brand);
      }
      .view-toggle button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5em;
        margin-left: 0.25em;
        width: 32px;
        height: 32px;
      }
      .view-toggle button img {
        width: 100%;
      }
      .view-toggle button.active {
        background-color: #eee;
        border-radius: 4px;
      }
      .search-bar {
        margin-bottom: 1rem;
        padding: 0.5em;
        width: 100%;
        max-width: 300px;
        border: solid 1px var(--app-color-brand);
      }
      .table-wrapper {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        margin-bottom: 1rem;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        padding: 0.75em;
        text-align: left;
        border-bottom: 1px solid #ddd;
        white-space: nowrap;
      }
      th {
        font-weight: 500;
        color: var(--app-color-brand);
        background: unset;
      }
      .card-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 25px 80px;
        width: calc(100% - 160px);
      }
      .card-container {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, minmax(500px, 1fr));
        grid-template-rows: repeat(2, auto);
        gap: 1rem;
        place-content: center;
      }
      .card {
        border: 1px solid #ddd;
        padding: 1rem;
        border-radius: 4px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      .card-top {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
      }
      .card-left, .card-right {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      .card-left div, .card-right div {
        margin-bottom: 0.5rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .card-left, .card-right {
        width: 100%;
        overflow: hidden;
      }
      .card-left {
        margin-right: 1rem;
      }
      .card label {
        font-size: 0.9em;
        font-weight: 500;
        color: #c5c5c5;
      }
      .card span {
        font-size: 1em;
        color: #333;
        font-weight: bold;
      }
      .card .actions {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        margin-top: 0.5rem;
        justify-content: flex-start;
      }
      .card .actions a {
        font-size: 16px;
        text-decoration: none;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
        color: #fff;
        padding: 0.5em 0.7em;
      }
      .card .actions a img {
        width: 20px;
      }
      .card .actions .cardEdit {
        text-decoration: none;
        color: #fff;
        background-color: rgb(82 80 153);
        border: none;
        border-radius: 4px;
      }
      .card .actions .cardDelete {
        background: var(--app-color-brand);
        color: #fff;
        cursor: pointer;
        border: none;
        border-radius: 4px;
      }
      .pagination {
        display: flex;
        list-style: none;
        padding: 0;
        margin: 1rem 0;
        gap: 0.5rem;
        align-items: center;
        justify-content: center;
      }
      .pagination li {
        cursor: pointer;
        padding: 0.5em 0.75em;
      }
      .pagination li.active {
        background-color: var(--app-color-brand);
        color: white;
        border: 1px solid #ccc;
        border-radius: 50%;
        border-color: var(--app-color-brand);
      }
      .pagination button {
        background: none;
        color: var(--app-color-brand);
        border: none;
        cursor: pointer;
        padding: 0.5em;
      }
      .pagination button:disabled {
        color: #ccc;
        cursor: not-allowed;
      }

      @media only screen and (min-width: 1920px) {
        .card-container {
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(2, auto);
        }
      }

      @media only screen and (max-width: 1279px) {
        .card-wrapper {
          margin: 25px 10px;
          width: calc(100% - 20px);
        }
        .card-container {
          grid-template-columns: repeat(2, minmax(400px, 1fr));
        }
      }
    `
  ];

  constructor() {
    super();
    this.viewMode = 'list';
    this.employees = getEmployees();
    this.search = '';
    this.page = 1;
    this._onLocaleChange = () => this.requestUpdate();
    this.confirmDialogOpen = false;
    this.employeeToDelete = null;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener(localeChangedEventName, this._onLocaleChange);
    window.addEventListener('resize', () => this.requestUpdate());
  }

  disconnectedCallback() {
    window.removeEventListener(localeChangedEventName, this._onLocaleChange);
    super.disconnectedCallback();
  }

  setView(mode) {
    this.viewMode = mode;
    this.page = 1;
  }

  handleSearch(e) {
    this.search = e.target.value.toLowerCase();
    this.page = 1;
  }

  get filteredEmployees() {
    if (!this.search) return this.employees;
    return this.employees.filter(emp => {
      const haystack = [
        emp.firstName,
        emp.lastName,
        emp.email,
        emp.department,
        emp.position,
        emp.phone,
        emp.dateOfEmployment,
        emp.dateOfBirth
      ].join(' ').toLowerCase();
      return haystack.includes(this.search);
    });
  }

  get perPage() {
    if (this.viewMode === 'list') return 9;
    if (this.viewMode === 'card' && window.innerWidth >= 1920) return 6;
    return 4;
  }

  get pagedEmployees() {
    const start = (this.page - 1) * this.perPage;
    return this.filteredEmployees.slice(start, start + this.perPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredEmployees.length / this.perPage);
  }

  changePage(p) {
    this.page = p;
  }

  deleteRecord(id) {
    if (confirm(t('confirmDelete'))) {
      deleteEmployee(id);
      this.employees = getEmployees();
      const perPage = this.viewMode === 'list' ? 9 : 4;
      if ((this.page - 1) * perPage >= this.filteredEmployees.length && this.page > 1) {
        this.page--;
      }
      this.requestUpdate();
    }
  }

  confirmDelete(emp) {
    this.employeeToDelete = emp;
    this.confirmDialogOpen = true;
  }

  deleteConfirmed() {
  if (this.employeeToDelete) {
    deleteEmployee(this.employeeToDelete.id);
    this.employees = getEmployees();
    this.confirmDialogOpen = false;
    this.employeeToDelete = null;

    const perPage = this.viewMode === 'list' ? 9 : (this.viewMode === 'card' && window.innerWidth >= 1920) ? 6 : 4;

    const totalItemsAfterDelete = this.filteredEmployees.length;
    const maxPage = Math.ceil(totalItemsAfterDelete / perPage);

    if (this.page > maxPage) {
      this.page = Math.max(1, maxPage);
    }

    this.requestUpdate();
  }
}


  render() {
    const prevPage = this.page > 1 ? this.page - 1 : 1;
    const nextPage = this.page < this.totalPages ? this.page + 1 : this.totalPages;

    return html`
      <div class="header">
        <div class="title">${t('titleEmployees')}</div>
        <div class="view-toggle">
          <button
            class=${this.viewMode === 'list' ? 'active' : ''}
            @click=${() => this.setView('list')}
            title="${t('viewList')}"
          ><img src="./public/images/listView.png" alt="${t('viewList')}" title="${t('viewList')}"></button>
          <button
            class=${this.viewMode === 'card' ? 'active' : ''}
            @click=${() => this.setView('card')}
            title="${t('viewCard')}"
          ><img src="./public/images/gridView.png" alt="${t('viewCard')}" title="${t('viewCard')}"></button>
        </div>
      </div>

      <input
        class="search-bar"
        type="text"
        placeholder="${t('viewSearch')}"
        @input=${this.handleSearch}
      />
      <confirm-dialog
        .open=${this.confirmDialogOpen}
        .title=${t('deleteDialogTitle')}
        .message=${`${t('deleteDialogMessage')}${this.employeeToDelete?.firstName} ${this.employeeToDelete?.lastName}${t('deleteDialogMessage2')}`}
        .onConfirm=${() => this.deleteConfirmed()}
        .onCancel=${() => { this.confirmDialogOpen = false; }}>
      </confirm-dialog>

      ${this.viewMode === 'list' ? html`
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>${t('firstName')}</th>
                <th>${t('lastName')}</th>
                <th>${t('dateOfEmployment')}</th>
                <th>${t('dateOfBirth')}</th>
                <th>${t('phone')}</th>
                <th>${t('email')}</th>
                <th>${t('department')}</th>
                <th>${t('position')}</th>
                <th>${t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              ${this.pagedEmployees.map(emp => html`
                <tr>
                  <td>${emp.firstName}</td>
                  <td>${emp.lastName}</td>
                  <td>${emp.dateOfEmployment}</td>
                  <td>${emp.dateOfBirth}</td>
                  <td>${emp.phone}</td>
                  <td>${emp.email}</td>
                  <td>${t(emp.department.toLowerCase())}</td>
                  <td>${t(emp.position.toLowerCase())}</td>
                  <td class="actions">
                    <a href="/edit/${emp.id}"><img src="./public/images/editOrange32.png" title="${t('edit')}"></a>
                    <a href="javascript:void(0)" @click=${() => this.confirmDelete(emp)}><img src="./public/images/deleteOrange32.png" title="${t('delete')}"></a>
                  </td>
                </tr>
              `)}
            </tbody>
          </table>
        </div>
      ` : html`
        <div class="card-wrapper">
          <div class="card-container">
            ${this.pagedEmployees.map(emp => html`
              <div class="card">
                <div class="card-top">                
                  <div class="card-left">
                    <div><label>${t('firstName')}</label><span>${emp.firstName}</span></div>
                    <div><label>${t('dateOfEmployment')}</label><span>${emp.dateOfEmployment}</span></div>
                    <div><label>${t('phone')}</label><span>${emp.phone}</span></div>
                    <div><label>${t('department')}</label><span>${t(emp.department.toLowerCase())}</span></div>
                  </div>
                  <div class="card-right">
                    <div><label>${t('lastName')}</label><span>${emp.lastName}</span></div>
                    <div><label>${t('dateOfBirth')}</label><span>${emp.dateOfBirth}</span></div>
                    <div><label>${t('email')}</label><span title="${emp.email}">${emp.email}</span></div>
                    <div><label>${t('position')}</label><span>${t(emp.position.toLowerCase())}</span></div>
                  </div>
                </div>
                <div class="actions">
                    <a class="cardEdit" href="/edit/${emp.id}"><img src="./public/images/editWhite32.png" title="${t('edit')}">${t('edit')}</a>
                    <a class="cardDelete" href="javascript:void(0)" @click=${() => this.confirmDelete(emp)}><img src="./public/images/deleteWhite32.png" title="${t('delete')}">${t('delete')}</a>
                  </div>
              </div>
            `)}
          </div>
        </div>
      `}

      <ul class="pagination">
        <button @click=${() => this.changePage(prevPage)} ?disabled=${this.page === 1}> ⟨ </button>
        ${Array.from({ length: this.totalPages }, (_, i) => i + 1).map(p => html`
          <li
            class=${this.page === p ? 'active' : ''}
            @click=${() => this.changePage(p)}
          >${p}</li>
        `)}
        <button @click=${() => this.changePage(nextPage)} ?disabled=${this.page === this.totalPages}> ⟩ </button>
      </ul>
    `;
  }
}

customElements.define('employee-list', EmployeeList);