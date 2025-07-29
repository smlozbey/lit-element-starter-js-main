import { expect } from '@open-wc/testing';
import {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeById,
  isEmailUnique,
  isPhoneUnique
} from '../src/store.js';

describe('store.js', () => {
  beforeEach(() => {
    localStorage.clear();
    const list = getEmployees();
    list.splice(0, list.length);
  });

  it('adds a valid employee', () => {
    const emp = {
      firstName: 'Test',
      lastName: 'Tester',
      email: 'test1@example.com',
      phone: '+(90) 555 111 11 11',
      department: 'Tech',
      position: 'Junior'
    };
    const result = addEmployee(emp);
    const list = getEmployees();
    expect(result).to.be.true;
    expect(list.length).to.equal(1);
    expect(list[0].firstName).to.equal('Test');
  });

  it('does not add employee with duplicate phone', () => {
    addEmployee({
      firstName: 'A',
      email: 'a@example.com',
      phone: '+(90) 555 111 11 11'
    });
    const result = addEmployee({
      firstName: 'B',
      email: 'b@example.com',
      phone: '+(90) 555 111 11 11'
    });
    expect(result).to.be.false;
    expect(getEmployees().length).to.equal(1);
  });

  it('updates employee data', () => {
    addEmployee({
      id: 1,
      firstName: 'Test',
      email: 'test@example.com',
      phone: '+(90) 555 111 11 11'
    });
    const id = getEmployees()[0].id;
    const result = updateEmployee(id, { lastName: 'Tester' });
    expect(result).to.be.true;
    expect(getEmployees()[0].lastName).to.equal('Tester');
  });

  it('returns false when updating unknown employee', () => {
    const result = updateEmployee('invalid-id', { lastName: 'X' });
    expect(result).to.be.false;
  });

  it('deletes existing employee', () => {
    addEmployee({
      id: 1,
      firstName: 'Test',
      email: 'test@example.com',
      phone: '+(90) 555 111 11 11'
    });
    const id = getEmployees()[0].id;
    deleteEmployee(id);
    expect(getEmployees().length).to.equal(0);
  });

  it('when deleting unknown id no change on employees', () => {
    addEmployee({
      id: 1,
      firstName: 'Test',
      email: 'test@example.com',
      phone: '+(90) 555 111 11 11'
    });
    deleteEmployee('nonexistent-id');
    const list = getEmployees();
    expect(list.length).to.equal(1);
  });

  it('finds employee by id', () => {
    addEmployee({
      id: 1,
      firstName: 'Test',
      email: 'test@example.com',
      phone: '+(90) 555 111 11 11'
    });
    const emp = getEmployees()[0];
    const found = getEmployeeById(emp.id);
    expect(found).to.exist;
    expect(found.email).to.equal('test@example.com');
  });

  it('returns undefined for non-existing id', () => {
    const found = getEmployeeById('not-found');
    expect(found).to.be.undefined;
  });

  it('validates email uniqueness (true)', () => {
    addEmployee({
      id: 1,
      email: 'unique@example.com',
      phone: '+(90) 555 111 11 11'
    });
    expect(isEmailUnique('different@example.com', 2)).to.be.true;
  });

  it('validates email uniqueness (false)', () => {
    addEmployee({
      id: 2,
      email: 'test@example.com',
      phone: '+(90) 555 111 11 11'
    });
    const list = getEmployees();
    expect(isEmailUnique('test@example.com')).to.be.false;
  });

  it('validates phone uniqueness (true)', () => {
    addEmployee({
      email: 'test@example.com',
      phone: '+(90) 555 111 11 11'
    });
    expect(isPhoneUnique('+(90) 555 111 11 12')).to.be.true;
  });

  it('validates phone uniqueness (false)', () => {
    addEmployee({
      email: 'test@example.com',
      phone: '+(90) 555 111 11 11'
    });
    expect(isPhoneUnique('+(90) 555 111 11 11')).to.be.false;
  });
});
