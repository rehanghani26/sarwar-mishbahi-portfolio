import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, SlidersHorizontal, MessageSquare, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { fetchPublicQuestions } from '../../../store/slices/contentSlice';
import { Input } from '../../../components/Input';

export default function QAList() {
  const dispatch = useDispatch();

  const { publicList: questions, loading, page, pages } = useSelector((state) => state.content.questions);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const categories = [
    'Salah',
    'Fasting',
    'Zakat',
    'Hajj & Umrah',
    'Marriage',
    'Divorce',
    'Business',
    'Family Issues',
    'Education',
    'General Questions',
  ];

  useEffect(() => {
    dispatch(fetchPublicQuestions({ category: selectedCategory, search: searchTerm, page }));
  }, [dispatch, selectedCategory, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(fetchPublicQuestions({ category: selectedCategory, search: searchTerm, page: 1 }));
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    dispatch(fetchPublicQuestions({ category: category, search: searchTerm, page: 1 }));
  };

  const handlePageChange = (pageNum) => {
    dispatch(fetchPublicQuestions({ category: selectedCategory, search: searchTerm, page: pageNum }));
    window.scrollTo(0, 0);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="bg-[#FAF9F5] dark:bg-slate-900 py-12 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header Title */}
        <div className="mb-10 text-center">
          <span className="text-xs font-bold text-[#8A6F52] dark:text-amber-500 uppercase tracking-widest font-serif block mb-1">Interactive Learning</span>
          <h1 className="text-3xl font-extrabold text-[#2F241C] dark:text-[#8A6F52] font-serif tracking-wide">Questions & Answers</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-light mt-2 max-w-md mx-auto">
            Review public questions answered by the scholar, addressing practical issues in light of traditional Islamic jurisprudence.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="premium-card p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
            <Input
              type="text"
              placeholder="Search Q&As..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              inputClassName="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-[#EAE3CF] dark:border-slate-700 rounded outline-none focus:border-[#8A6F52] dark:focus:border-[#8A6F52] focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400"
              border=""
            />
            <button type="submit" className="absolute left-3 top-2.5 text-slate-400 hover:text-[#2F241C] dark:hover:text-[#8A6F52]">
              <Search className="w-4.5 h-4.5" />
            </button>
          </form>

          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
            <SlidersHorizontal className="w-4.5 h-4.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-[#EAE3CF] dark:border-slate-700 rounded outline-none text-slate-700 dark:text-slate-300 focus:border-[#8A6F52] dark:focus:border-[#8A6F52]"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content list Accordion */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2F241C]"></div>
          </div>
        ) : questions && questions.length > 0 ? (
          <div className="space-y-4 mb-10">
            {questions.map((q) => {
              const isExpanded = expandedId === q._id;
              return (
                <div key={q._id} className="premium-card rounded shadow-xs overflow-hidden transition-all duration-300">

                  {/* Collapsible Header */}
                  <button
                    onClick={() => toggleExpand(q._id)}
                    className="w-full p-5 text-left flex items-start justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="bg-[#2F241C]/10 dark:bg-amber-950/30 text-[#2F241C] dark:text-[#8A6F52] text-[10px] font-bold px-2 py-0.5 rounded">
                          {q.category}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          {new Date(q.answeredAt || q.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-md font-bold text-slate-900 dark:text-white leading-snug font-serif">
                        {q.questionTitle}
                      </h3>
                    </div>

                    <div className="text-slate-500 dark:text-slate-400 hover:text-[#2F241C] dark:hover:text-[#8A6F52] mt-1 shrink-0">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {/* Collapsible Content */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-700 bg-slate-50/20 dark:bg-slate-900/10">

                      {/* Detailed Question */}
                      <div className="bg-slate-50 dark:bg-slate-900 border-l-2 border-[#8A6F52] dark:border-amber-500 p-4 rounded mb-5 text-xs">
                        <span className="block font-bold text-[#2F241C] dark:text-[#8A6F52] mb-1.5">QUESTION DETAILS:</span>
                        <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed">
                          "{q.detailedQuestion}"
                        </p>
                      </div>

                      {/* Detailed Answer */}
                      <div className="text-sm leading-relaxed">
                        <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">SCHOLAR ANSWER:</span>
                        <div
                          className="prose prose-sm dark:prose-invert text-slate-800 dark:text-slate-200 leading-relaxed font-light whitespace-pre-line"
                          dangerouslySetInnerHTML={{ __html: q.answerContent }}
                        ></div>
                      </div>

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 premium-card">
            <MessageSquare className="w-12 h-12 text-[#8A6F52] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-white font-serif">No Answered Questions</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Try resetting search keywords or category filters.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && pages > 1 && (
          <div className="flex justify-center items-center gap-1.5 pt-4 text-slate-800 dark:text-white">
            <button
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3.5 py-1.5 rounded text-xs font-bold border border-[#EAE3CF] dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Previous
            </button>
            {[...Array(pages).keys()].map((pNum) => (
              <button
                key={pNum + 1}
                onClick={() => handlePageChange(pNum + 1)}
                className={`w-8.5 h-8.5 rounded text-xs font-bold border transition-colors ${page === pNum + 1
                    ? 'bg-[#2F241C] border-[#2F241C] text-white'
                    : 'bg-white dark:bg-slate-800 border-[#EAE3CF] dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
              >
                {pNum + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(Math.min(pages, page + 1))}
              disabled={page === pages}
              className="px-3.5 py-1.5 rounded text-xs font-bold border border-[#EAE3CF] dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
