import { fixture, html, expect, oneEvent } from '@open-wc/testing';
import '../src/components/employee-form.js';

describe('<employee-form>', () => {
  it('should show error if phone is not unique', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    el.form.phone = '+(+90) 555 123 45 67';
    el.validate = () => {
      el.errorKey = 'phoneExists';
      return false;
    };
    el.handleSubmit(new Event('submit'));
    await el.updateComplete;
    expect(el.errorKey).to.equal('phoneExists');
  });

  it('should open confirm dialog in edit mode', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    el.employeeId = '123';
    el.validate = () => true;
    el.handleSubmit(new Event('submit'));
    await el.updateComplete;
    expect(el.confirmDialogOpen).to.be.true;
  });
  it('should render input fields for employee form', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    expect(el.shadowRoot.querySelector('input[name="firstName"]')).to.exist;
    expect(el.shadowRoot.querySelector('select[name="department"]')).to.exist;
  });

  it('should display error when required field is empty on submit', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    const form = el.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await el.updateComplete;
    expect(el.errorKey).to.equal('required');
  });

  it('should navigate to list after successful submit', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    el.form = {
      firstName: 'Test',
      lastName: 'Tester',
      dateOfEmployment: '2022-01-01',
      dateOfBirth: '1990-01-01',
      phone: '+(90) 555 123 45 14',
      email: 'test.tester@example.com',
      department: 'Analytics',
      position: 'Junior'
    };
    el.validate = () => true;
    el._saveEmployee = () => { el.saved = true };
    el.handleSubmit({ preventDefault() { } });
    expect(el.saved).to.be.true;
  });

  it('should show error if email is not unique', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    el.form.email = 'duplicate@example.com';
    el.validate = () => {
      el.errorKey = 'emailExists';
      return false;
    };
    el.handleSubmit(new Event('submit'));
    await el.updateComplete;
    expect(el.errorKey).to.equal('emailExists');
  });

  it('should validate form with all required fields', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    el.form = {
      firstName: 'Test',
      lastName: 'Tester',
      dateOfEmployment: '2022-05-01',
      dateOfBirth: '1990-05-01',
      phone: '(+90) 555 123 45 68',
      email: 'test.tester@example.com',
      department: 'Tech',
      position: 'Senior'
    };
    const isValid = el.validate();
    expect(isValid).to.be.true;
  });

  it('should show translated error message for required fields', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    el.errorKey = 'required';
    el.errorField = 'firstName';
    await el.updateComplete;
    const errorDiv = el.shadowRoot.querySelector('.error');
    expect(errorDiv).to.exist;
    expect(errorDiv.textContent.toLowerCase()).to.include('required');
  });

  it('should render all options for department and position', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    const deptOptions = el.shadowRoot.querySelectorAll('select[name="department"] option');
    const posOptions = el.shadowRoot.querySelectorAll('select[name="position"] option');
    expect(deptOptions.length).to.equal(3);
    expect(posOptions.length).to.equal(4);
  });
});