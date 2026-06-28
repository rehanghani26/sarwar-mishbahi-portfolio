export const CATEGORY_MAP = {
  fatwas: [
    { value: 'Salah', labelUr: 'نماز', labelEn: 'Salah' },
    { value: 'Fasting', labelUr: 'روزہ', labelEn: 'Fasting' },
    { value: 'Zakat', labelUr: 'زکوٰۃ', labelEn: 'Zakat' },
    { value: 'Hajj & Umrah', labelUr: 'حج و عمرہ', labelEn: 'Hajj & Umrah' },
    { value: 'Marriage', labelUr: 'نکاح', labelEn: 'Marriage' },
    { value: 'Divorce', labelUr: 'طلاق', labelEn: 'Divorce' },
    { value: 'Business', labelUr: 'تجارت', labelEn: 'Business' },
    { value: 'Family Issues', labelUr: 'خاندانی امور', labelEn: 'Family Issues' },
    { value: 'Education', labelUr: 'تعلیم', labelEn: 'Education' },
    { value: 'General Questions', labelUr: 'عام معلومات', labelEn: 'General Questions' },
  ],
  publications: [
    { value: 'Quran Studies', labelUr: 'قرآنیات', labelEn: 'Quran Studies' },
    { value: 'Hadith', labelUr: 'حدیث', labelEn: 'Hadith' },
    { value: 'Fiqh', labelUr: 'فقہ', labelEn: 'Fiqh' },
    { value: 'Aqeedah', labelUr: 'عقیدہ', labelEn: 'Aqeedah' },
    { value: 'Seerah', labelUr: 'سیرت', labelEn: 'Seerah' },
    { value: 'Islamic History', labelUr: 'اسلامی تاریخ', labelEn: 'Islamic History' },
    { value: 'Fatwa Collections', labelUr: 'فتاویٰ مجموعات', labelEn: 'Fatwa Collections' },
    { value: 'Research Papers', labelUr: 'تحقیقی مقالات', labelEn: 'Research Papers' },
  ],
  articles: [
    { value: 'Quran', labelUr: 'قرآن', labelEn: 'Quran' },
    { value: 'Hadith', labelUr: 'حدیث', labelEn: 'Hadith' },
    { value: 'Fiqh', labelUr: 'فقہ', labelEn: 'Fiqh' },
    { value: 'Aqeedah', labelUr: 'عقیدہ', labelEn: 'Aqeedah' },
    { value: 'Seerah', labelUr: 'سیرت', labelEn: 'Seerah' },
    { value: 'Islamic History', labelUr: 'اسلامی تاریخ', labelEn: 'Islamic History' },
    { value: 'Family Matters', labelUr: 'خاندانی معاملات', labelEn: 'Family Matters' },
    { value: 'Education', labelUr: 'تعلیم', labelEn: 'Education' },
    { value: 'Dawah', labelUr: 'دعوت', labelEn: 'Dawah' },
    { value: 'General Islam', labelUr: 'عام معلوماتِ اسلام', labelEn: 'General Islam' },
  ],
  lectures: [
    { value: 'YouTube Videos', labelUr: 'یوٹیوب ویڈیوز', labelEn: 'YouTube Videos' },
    { value: 'Facebook Videos', labelUr: 'فیس بک ویڈیوز', labelEn: 'Facebook Videos' },
    { value: 'Audio Lectures', labelUr: 'صوتی بیانات', labelEn: 'Audio Lectures' },
    { value: 'Bayan Recordings', labelUr: 'ریکارڈنگز', labelEn: 'Bayan Recordings' },
  ],
  qa: [
    { value: 'Salah', labelUr: 'نماز', labelEn: 'Salah' },
    { value: 'Fasting', labelUr: 'روزہ', labelEn: 'Fasting' },
    { value: 'Zakat', labelUr: 'زکوٰۃ', labelEn: 'Zakat' },
    { value: 'Hajj & Umrah', labelUr: 'حج و عمرہ', labelEn: 'Hajj & Umrah' },
    { value: 'Marriage', labelUr: 'نکاح', labelEn: 'Marriage' },
    { value: 'Divorce', labelUr: 'طلاق', labelEn: 'Divorce' },
    { value: 'Business', labelUr: 'تجارت', labelEn: 'Business' },
    { value: 'Family Issues', labelUr: 'خاندانی امور', labelEn: 'Family Issues' },
    { value: 'Education', labelUr: 'تعلیم', labelEn: 'Education' },
    { value: 'General Questions', labelUr: 'عام معلومات', labelEn: 'General Questions' },
  ]
};

// Category Arrays for Option Lists & Inputs
export const FATWA_CATEGORIES = CATEGORY_MAP.fatwas.map(c => c.value);
export const PUBLICATION_CATEGORIES = CATEGORY_MAP.publications.map(c => c.value);
export const ARTICLE_CATEGORIES = CATEGORY_MAP.articles.map(c => c.value);
export const LECTURE_CATEGORIES = CATEGORY_MAP.lectures.map(c => c.value);
export const QA_CATEGORIES = CATEGORY_MAP.qa.map(c => c.value);

// Translation Maps (value -> labelUr)
export const FATWA_TRANSLATIONS = CATEGORY_MAP.fatwas.reduce((acc, c) => {
  acc[c.value] = c.labelUr;
  return acc;
}, {});

export const PUBLICATION_TRANSLATIONS = CATEGORY_MAP.publications.reduce((acc, c) => {
  acc[c.value] = c.labelUr;
  return acc;
}, {});

export const ARTICLE_TRANSLATIONS = CATEGORY_MAP.articles.reduce((acc, c) => {
  acc[c.value] = c.labelUr;
  return acc;
}, {});

export const LECTURE_TRANSLATIONS = CATEGORY_MAP.lectures.reduce((acc, c) => {
  acc[c.value] = c.labelUr;
  return acc;
}, {});

export const QA_TRANSLATIONS = CATEGORY_MAP.qa.reduce((acc, c) => {
  acc[c.value] = c.labelUr;
  return acc;
}, {});
