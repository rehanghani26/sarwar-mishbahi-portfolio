import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, BookOpen, Book, Download } from 'lucide-react';
import { getPublications } from '@/services';
import { useSettings } from '@/hooks/useSettings';
import { PublicationCard } from '@/components';
import { COLORS } from '@/utils/themeColors';
import { PUBLICATION_CATEGORIES, PUBLICATION_TRANSLATIONS } from '@/utils/categories';

/* ─── Sidebar section header (dark brown + icon) ─────────── */
function SidebarHeader({ label, icon: Icon = Book }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3"
      style={{ backgroundColor: COLORS.primary }}
    >
      <span className="text-base font-bold text-white font-serif">{label}</span>
      <Icon className="w-4 h-4" style={{ color: COLORS.accent }} />
    </div>
  );
}

/* ─── Sidebar link ─────────────────────────────────────────────── */
function SidebarLink({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-right px-4 py-2.5 text-sm font-medium transition-all rounded-sm flex items-center justify-between border-b last:border-b-0 hover:bg-slate-50"
      style={{
        color: active ? COLORS.primary : COLORS.textPrimary,
        fontWeight: active ? 700 : 500,
        backgroundColor: active ? `${COLORS.secondary}70` : 'transparent',
        borderColor: `${COLORS.border}50`,
      }}
    >
      <span>{label}</span>
      <span className="text-xs" style={{ color: COLORS.accent }}>•</span>
    </button>
  );
}

export default function PublicationsList() {
  const { settings } = useSettings();
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';
  const [searchParams] = useSearchParams();
  const queryCategory = searchParams.get('category');

  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const isRTL = language === 'ur';

  useEffect(() => {
    if (queryCategory !== null) {
      setSelectedCategory(queryCategory);
    } else {
      setSelectedCategory('');
    }
  }, [queryCategory]);

  const loadPublications = async (pageNum = page, category = selectedCategory, search = searchTerm) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPublications({ category, search, page: pageNum, limit: 10 });
      setPublications(data.books || []);
      setPages(data.pages || 1);
      setPage(data.page || 1);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPublications(page, selectedCategory, searchTerm);
  }, [selectedCategory, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadPublications(1, selectedCategory, searchTerm);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    loadPublications(1, category, searchTerm);
  };

  const handlePageChange = (pageNum) => {
    loadPublications(pageNum, selectedCategory, searchTerm);
    window.scrollTo(0, 0);
  };

  const categories = PUBLICATION_CATEGORIES;

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen py-8"
      style={{ backgroundColor: COLORS.background }}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page heading ── */}
        <div className="text-center mb-8">
          <span
            className="text-xs font-bold uppercase tracking-widest block mb-1 font-serif"
            style={{ color: COLORS.accent }}
          >
            {isRTL ? 'علمی تصانیف' : 'SCIENTIFIC WORKS'}
          </span>

          <div className="flex items-center justify-center gap-4 mb-2">
            {/* decorative diamond */}
            <span style={{ color: COLORS.accent }} className="text-2xl select-none">❖</span>
            <h1
              className="text-3xl sm:text-4xl font-extrabold font-serif"
              style={{ color: COLORS.primary }}
            >
              {isRTL ? 'کتب و مطبوعات' : 'Books & Publications'}
            </h1>
            <span style={{ color: COLORS.accent }} className="text-2xl select-none">❖</span>
          </div>

          <p className="text-sm font-light" style={{ color: COLORS.textSecondary }}>
            {isRTL
              ? 'گوگل ڈرائیو پر موجود کتابیں، مقالات اور تعلیمی نوٹس حاصل کریں اور ان کا مطالعہ کریں۔'
              : 'Access and study books, articles, and educational notes on Google Drive.'}
          </p>
        </div>

        {/* ── Two-column layout ── */}
        <div className={`flex flex-col lg:flex-row gap-6 ${isRTL ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-start`}>

          {/* ── MAIN: publication cards ── */}
          <div className="flex-1 min-w-0 w-full">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: COLORS.primary }} />
              </div>
            ) : publications && publications.length > 0 ? (
              <>
                <div className="flex flex-col gap-4 mb-10">
                  {publications.map((pub) => (
                    <PublicationCard key={pub._id} publication={pub} />
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex justify-center items-center gap-1.5 pt-4">
                    <button
                      onClick={() => handlePageChange(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-3.5 py-1.5 rounded text-xs font-bold border disabled:opacity-40 transition-colors"
                      style={{ borderColor: COLORS.border, backgroundColor: COLORS.white, color: COLORS.textSecondary }}
                    >
                      {isRTL ? 'پچھلا' : 'Previous'}
                    </button>
                    {[...Array(pages).keys()].map((pNum) => (
                      <button
                        key={pNum + 1}
                        onClick={() => handlePageChange(pNum + 1)}
                        className="w-8 h-8 rounded text-xs font-bold border transition-colors"
                        style={{
                          backgroundColor: page === pNum + 1 ? COLORS.primary : COLORS.white,
                          borderColor: page === pNum + 1 ? COLORS.primary : COLORS.border,
                          color: page === pNum + 1 ? '#fff' : COLORS.textSecondary,
                        }}
                      >
                        {pNum + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(Math.min(pages, page + 1))}
                      disabled={page === pages}
                      className="px-3.5 py-1.5 rounded text-xs font-bold border disabled:opacity-40 transition-colors"
                      style={{ borderColor: COLORS.border, backgroundColor: COLORS.white, color: COLORS.textSecondary }}
                    >
                      {isRTL ? 'اگلا' : 'Next'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 rounded-lg border" style={{ backgroundColor: COLORS.white, borderColor: COLORS.border }}>
                <BookOpen className="w-12 h-12 mx-auto mb-4" style={{ color: COLORS.accent }} />
                <h3 className="text-lg font-bold font-serif mb-1" style={{ color: COLORS.textPrimary }}>
                  {isRTL ? 'کوئی مطبوعہ دستیاب نہیں ہے' : 'No publications available'}
                </h3>
                <p className="text-xs" style={{ color: COLORS.textSecondary }}>
                  {isRTL ? 'براہ کرم تلاش کے الفاظ یا فلٹر تبدیل کریں۔' : 'Try changing the search or filters.'}
                </p>
              </div>
            )}
          </div>

          {/* ── SIDEBAR ── */}
          <aside className="w-full lg:w-72 xl:w-80 shrink-0">

            {/* Search Books widget */}
            <div className="mb-6 rounded-sm overflow-hidden border shadow-sm" style={{ borderColor: COLORS.border }}>
              <SidebarHeader label={isRTL ? 'کتب تلاش کریں' : 'Search Books'} icon={Search} />
              <div className="p-3" style={{ backgroundColor: COLORS.white }}>
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    placeholder={isRTL ? 'مطبوعات تلاش کریں...' : 'Search publications...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm outline-none transition-all"
                    style={{
                      borderColor: COLORS.border,
                      backgroundColor: COLORS.background,
                      color: COLORS.textPrimary,
                      textAlign: isRTL ? 'right' : 'left',
                      paddingRight: isRTL ? '2.25rem' : '0.75rem',
                      paddingLeft: isRTL ? '0.75rem' : '2.25rem',
                    }}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                  <button
                    type="submit"
                    className="absolute top-2.5 transition-opacity hover:opacity-70 cursor-pointer"
                    style={{
                      [isRTL ? 'right' : 'left']: '0.65rem',
                      color: COLORS.accent,
                    }}
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </form>
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      loadPublications(1, selectedCategory, '');
                    }}
                    className="mt-2 text-xs text-slate-500 hover:text-primary underline block text-center w-full"
                  >
                    {isRTL ? 'تلاش ختم کریں' : 'Clear search'}
                  </button>
                )}
              </div>
            </div>

            {/* Related books */}
            <div className="mb-6 rounded-sm overflow-hidden border shadow-sm" style={{ borderColor: COLORS.border }}>
              <SidebarHeader label={isRTL ? 'مربوط کتابیں' : 'Related Books'} />
              <div
                className="p-1"
                style={{ backgroundColor: COLORS.white }}
              >
                <SidebarLink
                  label={isRTL ? 'تمام کتب' : 'All Books'}
                  active={selectedCategory === ''}
                  onClick={() => handleCategoryChange('')}
                />
              </div>
            </div>

            {/* Topics / Categories */}
            <div className="rounded-sm overflow-hidden border shadow-sm" style={{ borderColor: COLORS.border }}>
              <SidebarHeader label={isRTL ? 'مضامین کریں' : 'Topics'} />
              <div
                className="p-1"
                style={{ backgroundColor: COLORS.white }}
              >
                {categories.map((cat) => (
                  <SidebarLink
                    key={cat.value}
                    label={isRTL ? cat.labelUr : cat.labelEn}
                    active={selectedCategory === cat.value}
                    onClick={() => handleCategoryChange(cat.value)}
                  />
                ))}
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}
