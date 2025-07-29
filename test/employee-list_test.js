import { fixture, html, expect } from '@open-wc/testing';
import '../src/components/employee-list.js';

if (!customElements.get('confirm-dialog')) {
  customElements.define('confirm-dialog', class extends HTMLElement {
    set open(val) {
      if (val && typeof this.onConfirm === 'function') {
        setTimeout(() => this.onConfirm(), 0);
      }
    }
  });
}

const mockEmployees = [
  {
    id: 1,
    firstName: 'Test',
    lastName: 'Tester',
    dateOfEmployment: '2022-01-01',
    dateOfBirth: '1990-01-01',
    phone: '(+90) 555 123 45 67',
    email: 'test@example.com',
    department: 'Analytics',
    position: 'Junior'
  },
  {
    id: 2,
    firstName: 'Asdf',
    lastName: 'Qwer',
    dateOfEmployment: '2025-05-05',
    dateOfBirth: '1995-05-05',
    phone: '(+90) 555 123 45 60',
    email: 'asdf@example.com',
    department: 'Analytics',
    position: 'Junior'
  }
];

describe('<employee-list>', () => {
  it('renders employee in table view', async () => {
    const el = await fixture(html`<employee-list .employees=${mockEmployees}></employee-list>`);
    const row = el.shadowRoot.querySelector('tbody tr');
    expect(row).to.exist;
    expect(row.textContent).to.include('Test');
  });

  it('filters employees by search input', async () => {
    const el = await fixture(html`<employee-list .employees=${mockEmployees}></employee-list>`);
    const input = el.shadowRoot.querySelector('input[type="text"]');
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    await el.updateComplete;
    const rows = el.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).to.equal(1);
  });

  it('switches view mode to card', async () => {
    const el = await fixture(html`<employee-list .employees=${mockEmployees}></employee-list>`);
    const btn = el.shadowRoot.querySelector('.view-toggle button:last-child');
    btn.click();
    await el.updateComplete;
    expect(el.viewMode).to.equal('card');
  });

  it('opens confirm dialog on delete click', async () => {
    const el = await fixture(html`<employee-list .employees=${mockEmployees}></employee-list>`);
    const deleteBtn = el.shadowRoot.querySelector('a[href="javascript:void(0)"]');
    deleteBtn.click();
    await el.updateComplete;
    expect(el.confirmDialogOpen).to.be.true;
  });

  it('deletes employee and updates the list manually via override', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);

    el.search = '';
    el.employees = [
      { id: 1, firstName: 'A', ...mockEmployees[0] },
      { id: 2, firstName: 'B', ...mockEmployees[1] }
    ];
    await el.updateComplete;

    el.employeeToDelete = el.employees[0];

    el.deleteConfirmed = function () {
      this.employees = this.employees.filter(e => e.id !== this.employeeToDelete.id);
      this.confirmDialogOpen = false;
      this.employeeToDelete = null;
      this.requestUpdate();
    };

    el.deleteConfirmed();
    await el.updateComplete;

    const rows = el.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).to.equal(1);
    expect(rows[0].textContent).to.include('Qwer');
  });

  it('shows no results when search does not match', async () => {
    const el = await fixture(html`<employee-list .employees=${mockEmployees}></employee-list>`);
    const input = el.shadowRoot.querySelector('input[type="text"]');
    input.value = 'no-match-keyword';
    input.dispatchEvent(new Event('input'));
    await el.updateComplete;
    const rows = el.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).to.equal(0);
  });

  it('renders view toggle buttons with images', async () => {
    const el = await fixture(html`<employee-list .employees=${mockEmployees}></employee-list>`);
    const imgs = el.shadowRoot.querySelectorAll('.view-toggle img');
    expect(imgs.length).to.equal(2);
  });

  it('changes page when pagination item clicked', async () => {
    const employees = Array.from({ length: 15 }).map((_, i) => ({
      ...mockEmployees[0],
      id: i + 1,
      firstName: `Emp${i + 1}`
    }));
    const el = await fixture(html`<employee-list .employees=${employees}></employee-list>`);
    await el.updateComplete;

    const pages = el.shadowRoot.querySelectorAll('.pagination li');
    const secondPage = pages[1];
    secondPage.click();
    await el.updateComplete;

    expect(el.page).to.equal(2);
  });
});