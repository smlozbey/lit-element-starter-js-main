import { LitElement, html, css } from 'lit';
import { addEmployee, updateEmployee, getEmployeeById, isEmailUnique, isPhoneUnique } from '../store.js';
import { Router } from '@vaadin/router';
import { t, localeChangedEventName } from '../localization.js';
import { sharedStyles } from '../styles/shared-styles.js';
import '/src/components/confirm-dialog.js';

class EmployeeForm extends LitElement {
  static properties = {
    employeeId:   { type: String },
    form:         { type: Object },
    errorKey:     { type: String },
    errorField:   { type: String },
    confirmDialogOpen: { type: Boolean }
  };

  static styles = [
    sharedStyles,
    css`
      input[type="date"] {
        appearance: none;
        -webkit-appearance: none;
        position: relative;
        padding-right: 2.5em;
        background-color: white;
      }

      input[type="date"]::-webkit-calendar-picker-indicator {
        opacity: 0;
        cursor: pointer;
        position: absolute;
        right: 0.5em;
        width: 1em;
        height: 1em;
      }


      input[type="date"] {
        background-image: url('/public/images/dataPicker.png');
        background-repeat: no-repeat;
        background-position: right 0.5em center;
        background-size: 1.2em 1.2em;
      }


      input[type="date"]::-moz-calendar-picker-indicator {
        opacity: 0;
      }
    .header {
      display: flex;
      flex-direction: column;
      margin-bottom: 1rem;
    }
    .title {
      font-size: 1.5em;
      font-weight: bold;
      color: var(--app-color-brand);
    }
    .form-body {
      padding: 20px;
      background: #fff;
    }
    .sub-info {
      font-size: 0.9em;
      font-weight: 600;
      color: #000;
      margin-top: 0.5rem;
    }

    h2 {
      font-size: 1.8rem;
      color: var(--app-color-brand, #FF6200);
      margin-bottom: 1.5rem;
    }

    form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem 2rem;
      padding: 20px;
      background: #fff;
    }

    label {
      font-size: 0.9rem;
      font-weight: 500;
      color: #444;
      display: block;
      margin-bottom: 0.3rem;
    }

    input,
    select {
      width: 100%;
      padding: 0.6rem 0.8rem;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color: #f9f9f9;
      transition: border 0.2s ease;
      margin-top: 5px;
    }

    input:focus,
    select:focus {
      border-color: var(--app-color-brand, #FF6200);
      outline: none;
    }

    .form-actions {
      grid-column: 1 / -1;
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    button {
      font-size: 1rem;
      padding: 0.6rem 1.2rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      color: #fff;
      background-color: var(--app-color-brand, #FF6200);
      transition: background-color 0.2s ease;
    }

    button.cancel2list {
      border: 1px solid rgb(82 80 153);
      background-color: unset;
      color: rgb(82 80 153);
    }

    .save {
      background-color: var(--app-color-brand, #FF6200);
      color: white;
    }

    .cancel {
      background-color: #ddd;
      color: #333;
    }

    button:hover {
      opacity: 0.9;
    }

    @media (max-width: 768px) {
      form {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
        align-items: stretch;
      }

      button {
        width: 100%;
      }
    }
  `
  ];


  constructor() {
    super();
    this.employeeId = null;
    this.form = { firstName: '', lastName: '', dateOfEmployment: '', dateOfBirth: '', phone: '', email: '', department: '', position: '' };
    this.errorKey = '';
    this.errorField = '';
    this._onLocaleChange = () => this.requestUpdate();
    this.confirmDialogOpen = false;
  }

  connectedCallback() {
    super.connectedCallback();
    const match = window.location.pathname.match(/edit\/(.+)/);
    if (match) {
      const emp = getEmployeeById(match[1]);
      if (emp) {
        this.employeeId = emp.id;
        this.form = { ...emp };
      }
    }
    window.addEventListener(localeChangedEventName, this._onLocaleChange);
  }

  disconnectedCallback() {
    window.removeEventListener(localeChangedEventName, this._onLocaleChange);
    super.disconnectedCallback();
  }

  handleInput(e) {
    this.form = { ...this.form, [e.target.name]: e.target.value };
    this.errorKey = '';
    this.errorField = '';
  }

  validate() {
    for (const key of Object.keys(this.form)) {
      if (!this.form[key]) {
        this.errorKey = 'required';
        this.errorField = key;
        return false;
      }
    }
    if (!isEmailUnique(this.form.email, this.employeeId)) {
      this.errorKey = 'emailExists';
      this.errorField = '';
      return false;
    }
    if (!isPhoneUnique(this.form.phone, this.employeeId)) {
      this.errorKey = 'phoneExists';
      this.errorField = '';
      return false;
    }
    return true;
  }

  _saveEmployee() {
    let success;
    if (this.employeeId) {
      success = updateEmployee(this.employeeId, this.form);
    } else {
      success = addEmployee(this.form);
    }

    if (!success) {
      this.errorKey = 'invalidPhoneFormat';
      this.errorField = '';
      return;
    }

    Router.go('/list');
  }

  handleSubmit(e) {
    e.preventDefault();
    this.errorKey = '';
    this.errorField = '';

    if (!this.validate()) return;

    if (this.employeeId) {
      this.confirmDialogOpen = true;
      return;
    }

    this._saveEmployee();
  }

  handleCancel() {
    Router.go('/list');
  }

  render() {
    return html`
      <div class="header">
        <div class="title">${t('titleEditEmployee')}</div>
      </div>
      <div class="form-body">
        <div class="sub-info">${t('updateRecordInfo')}${this.form.firstName} ${this.form.lastName}</div>
        <form @submit=${this.handleSubmit}>
          <label>${t('firstName')}<input name="firstName" .value=${this.form.firstName} @input=${this.handleInput} required /></label>
          <label>${t('lastName')}<input name="lastName" .value=${this.form.lastName} @input=${this.handleInput} required /></label>
          <label>${t('dateOfEmployment')}<input type="date" name="dateOfEmployment" .value=${this.form.dateOfEmployment} @input=${this.handleInput} required /></label>
          <label>${t('dateOfBirth')}<input type="date" name="dateOfBirth" .value=${this.form.dateOfBirth} @input=${this.handleInput} required /></label>
          <label>${t('phone')}<input name="phone" .value=${this.form.phone} @input=${this.handleInput} required /></label>
          <label>${t('email')}<input type="email" name="email" .value=${this.form.email} @input=${this.handleInput} required /></label>
          <label>${t('department')}
            <select name="department" .value=${this.form.department} @change=${this.handleInput} required>
              <option value="">${t('selectDepartment')}</option>
              <option value="Analytics">${t('analytics')}</option>
              <option value="Tech">${t('tech')}</option>
            </select>
          </label>
          <label>${t('position')}
            <select name="position" .value=${this.form.position} @change=${this.handleInput} required>
              <option value="">${t('selectPosition')}</option>
              <option value="Junior">${t('junior')}</option>
              <option value="Medior">${t('medior')}</option>
              <option value="Senior">${t('senior')}</option>
            </select>
          </label>
          <div class="form-actions">
            <button type="submit">${t('save')}</button>
            <button class="cancel2list" type="button" @click=${this.handleCancel}>${t('cancel')}</button>
          </div>
        </form>
        ${this.errorKey ? html`<div class="error">${this.errorKey === 'required' ? `${t('required')}: ${t(this.errorField)}` : t(this.errorKey)}</div>` : ''}
      </div>
      <confirm-dialog
        .open=${this.confirmDialogOpen}
        .title=${t('deleteDialogTitle')}
        .message=${`${t('editDialogMessage')}${this.form?.firstName} ${this.form?.lastName}`}
        .onConfirm=${() => { this.confirmDialogOpen = false; this._saveEmployee(); }}
        .onCancel=${() => { this.confirmDialogOpen = false; }}>
      </confirm-dialog>
    `;
  }
}
customElements.define('employee-form', EmployeeForm);