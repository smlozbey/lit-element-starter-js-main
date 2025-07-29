export const translations = {
  en: {
      navLang: './public/images/tr.png',
      navLangValue: 'tr',
      navEmployees: 'Employees',
      navAddNew: 'Add New',
      titleEmployees: 'Employee List',
      titleEditEmployee: 'Edit Employee',
      viewList: 'List View',
      viewCard: 'Card View',
      viewSearch: 'Search...',
      addNew: 'Add New',
      edit: 'Edit',
      delete: 'Delete',
      confirmDelete: 'Are you sure you want to delete this record?',
      save: 'Save',
      cancel: 'Cancel',
      close: 'Close',
      proceed: 'Proceed',
      deleteDialogTitle: 'Are you sure?',
      deleteDialogMessage: 'Selected record of ',
      deleteDialogMessage2: ' will be deleted!',
      editDialogMessage: 'You are editing: ',
      name: 'Name',
      position: 'Position',
      actions: 'Actions',
      firstName: 'First Name',
      lastName: 'Last Name',
      dateOfEmployment: 'Date of Employment',
      dateOfBirth: 'Date of Birth',
      phone: 'Phone',
      email: 'Email',
      department: 'Department',
      required: 'Required',
      emailExists: 'This email already exists!',
      phoneExists: 'This phone number already exists!',
      selectDepartment: 'Select Department',
      selectPosition: 'Select Position',
      analytics: 'Analytics',
      tech: 'Tech',
      junior: 'Junior',
      medior: 'Medior',
      senior: 'Senior',
      updateRecordInfo: 'You are editing ',
      updateRecord: 'Update this record?',
      invalidPhoneFormat: 'Please enter phone as +(90) 555 123 45 67',
    },
    tr: {
      navLang: './public/images/en.png',
      navLangValue: 'en',
      navEmployees: 'Çalışanlar',
      navAddNew: 'Yeni Ekle',
      titleEmployees: 'Çalışan Listesi',
      titleEditEmployee: 'Çalışanı Düzenle',
      viewList: 'Liste Görünümü',
      viewCard: 'Kart Görünümü',
      viewSearch: 'Ara...',
      addNew: 'Yeni Ekle',
      edit: 'Düzenle',
      delete: 'Sil',
      confirmDelete: 'Bu kaydı silmek istediğinizden emin misiniz?',
      save: 'Kaydet',
      cancel: 'İptal',
      close: 'Kapat',
      proceed: 'Devam Et',
      deleteDialogTitle: 'Emin misiniz?',
      deleteDialogMessage: '',
      deleteDialogMessage2: ' kişisinin kaydı silinecek!',
      editDialogMessage: 'Düzenlediğiniz Kişi: ',
      name: 'Ad Soyad',
      position: 'Pozisyon',
      actions: 'İşlemler',
      firstName: 'Ad',
      lastName: 'Soyad',
      dateOfEmployment: 'İşe Giriş Tarihi',
      dateOfBirth: 'Doğum Tarihi',
      phone: 'Telefon',
      email: 'E-posta',
      department: 'Departman',
      required: 'Zorunlu',
      emailExists: 'Bu e-posta zaten mevcut!',
      phoneExists: 'Bu telefon numarası zaten mevcut!',
      selectDepartment: 'Departman Seç',
      selectPosition: 'Pozisyon Seç',
      analytics: 'Analitik',
      tech: 'Teknoloji',
      junior: 'Yeni',
      medior: 'Orta',
      senior: 'Kıdemli',
      updateRecordInfo: 'Düzenlediğiniz kişi ',
      updateRecord: 'Kaydı güncellemek istiyor musunuz?',
      invalidPhoneFormat: 'Lütfen telefon numarasını +(90) 555 123 45 67 şeklinde girin',
    }
};

const localeChangedEventName = 'locale-changed';

const STORAGE_KEY = 'app_locale';
const DEFAULT_LOCALE = 'en';

let currentLocale = (() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && translations[saved]) return saved;
  const htmlLang = document.documentElement.lang;
  if (htmlLang && translations[htmlLang]) return htmlLang;
  return DEFAULT_LOCALE;
})();

export function setLocale(locale) {
  if (!translations[locale]) {
    console.warn(`Bilinmeyen locale: "${locale}"`);
    return;
  }
  currentLocale = locale;
  localStorage.setItem(STORAGE_KEY, locale);
  window.dispatchEvent(new CustomEvent(localeChangedEventName, { detail: { locale } }));
}

export function t(key) {
  const dict = translations[currentLocale] || {};
  return dict[key] ?? key;
}

export { localeChangedEventName };

export function getLocale() {
  return currentLocale;
}