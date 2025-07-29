let employees = JSON.parse(localStorage.getItem('employees')) || [];

const PHONE_PATTERN = /^\+\(90\) \d{3} \d{3} \d{2} \d{2}$/;

function normalizePhone(raw) {
  return raw
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function validateAndFormatPhone(rawPhone) {
  const formatted = normalizePhone(rawPhone);
  if (!PHONE_PATTERN.test(formatted)) {
    return null;
  }
  return formatted;
}

export const getEmployees = () => [...employees];

export const addEmployee = (emp) => {
  if (!isEmailUnique(emp.email)) return false;

  if (emp.phone) {
    const formattedPhone = validateAndFormatPhone(emp.phone);
    if (!formattedPhone || !isPhoneUnique(formattedPhone)) {
      return false;
    }
    emp.phone = formattedPhone;
  }

  employees.push({ id: Date.now().toString(), ...emp });
  localStorage.setItem('employees', JSON.stringify(employees));
  return true;
};

export const updateEmployee = (id, updated) => {
  const index = employees.findIndex(e => e.id === id);
  if (index === -1) {
    return false;
  }
  if (!isEmailUnique(updated.email, id)) return false;

  if (updated.phone) {
    const formattedPhone = validateAndFormatPhone(updated.phone);
    if (!formattedPhone || !isPhoneUnique(formattedPhone, id)) {
      return false;
    }
    updated.phone = formattedPhone;
  }

  employees = employees.map(emp =>
    emp.id === id ? { ...emp, ...updated } : emp
  );
  localStorage.setItem('employees', JSON.stringify(employees));
  return true;
};

export const deleteEmployee = (id) => {
  employees = employees.filter(emp => emp.id !== id);
  localStorage.setItem('employees', JSON.stringify(employees));
};

export const getEmployeeById = (id) => employees.find(emp => emp.id === id);

export const isEmailUnique = (email, excludeId = null) =>
  !employees.some(emp => emp.email === email && emp.id !== excludeId);

export const isPhoneUnique = (phone, excludeId = null) =>
  !employees.some(emp => emp.phone === phone && emp.id !== excludeId);