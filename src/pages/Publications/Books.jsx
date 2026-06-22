import React from 'react'
import PageContainer from '../../components/PageContainer'
import { BOOKS } from '../../constants/siteData'
import { useSettings } from '../../../context/SettingsContext';

export default function Books() {
  const { settings } = useSettings();
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  return (
    <PageContainer
      title={language === 'en' ? 'Useful Educational & Reformative Books' : 'مفید علمی و اصلاحی کتابیں'}
      subtitle={language === 'en' ? 'Masterpieces written by the elders of Jamia Banuri Town' : 'جامعہ بنوری ٹاؤن کے اکابرین کی تحریر کردہ شاہکار کتب'}
    >
      <div className={`space-y-6 ${language === 'ur' ? 'text-right' : 'text-left'}`} dir={language === 'ur' ? 'rtl' : 'ltr'}>
        <p>
          {language === 'en'
            ? 'The writing and compilation department of the Jamia is active in scientific and research activities. Numerous valuable religious, jurisprudential, and educational books written by the elders of the Jamia are provided free of charge for study.'
            : 'جامعہ کا شعبہ تصنیف و تالیف علمی تحقیقی سرگرمیوں میں پیش پیش ہے۔ اکابرینِ جامعہ کی تحریر کردہ متعدد گرانقدر دینی، فقہی اور تعلیمی کتابیں مطالعہ کے لیے بلا معاوضہ فراہم کی جاتی ہیں۔'
          }
        </p>

        <h3 className="text-[22px] font-bold text-[#3A2C23] border-b pb-2">
          {language === 'en' ? 'Featured Books Repository' : 'نمایاں کتب کا ذخیرہ'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
          {BOOKS.map((book) => (
            <div
              key={book.id}
              className="border border-[#D9D9D9] rounded-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow bg-white text-center"
            >
              {/* Book cover representation */}
              <div
                style={{ background: book.gradient || 'linear-gradient(160deg, #3d2e1e 0%, #1F3A5F 100%)' }}
                className="h-[200px] flex items-center justify-center p-4 text-white font-bold text-[20px] select-none shadow-inner"
              >
                {book.title}
              </div>

              {/* Book Info */}
              <div className="p-4 bg-gray-50 border-t border-[#D9D9D9] flex flex-col gap-2">
                <span className="text-[17px] font-bold text-[#3A2C23]">{book.title}</span>
                <span className="text-[13px] text-[#B08D57]">
                  {language === 'en' ? 'Publishing Department, Jamia Banuri Town' : 'شعبہ نشر و اشاعت، جامعہ بنوری ٹاؤن'}
                </span>
                <button
                  onClick={() => alert(language === 'en' ? `Reading of "${book.title}" will be available on the website soon.` : `"${book.title}" کا مطالعہ جلد ہی ویب سائٹ پر میسر ہوگا۔`)}
                  className="mt-2 bg-[#1F3A5F] hover:bg-[#1F3A5F] text-white py-1.5 text-[14px] font-bold transition-colors shadow-sm"
                >
                  {language === 'en' ? '📖 Read Free Online' : '📖 مفت آن لائن پڑھیں'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  )
}
