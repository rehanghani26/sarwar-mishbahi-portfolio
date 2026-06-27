import React from 'react'
import { NEW_QUESTION, SELECTED_QUESTIONS } from '@/data/siteData'

export default function QuestionsSection() {
  return (
    <section className="py-[22px] px-4 md:px-7" aria-label="سوالات">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 border border-site-border">

        {/* RIGHT col — New question */}
        <div className="bg-card-bg border-l border-site-border flex flex-col">
          <div className="h-14 flex items-center justify-center text-[23px] font-bold bg-cream dark:bg-slate-700 text-[#1F3A5F] dark:text-white">
            نئے سوالات
          </div>
          <div className="p-5 flex-1">
            <div className="text-[13px] text-text-muted mb-3 ltr text-right">تاریخ : {NEW_QUESTION.date}</div>
            <div className="text-[24px] font-bold text-text-primary leading-[1.7] mb-3">{NEW_QUESTION.title}</div>
            <div className="text-[15px] text-text-secondary leading-[2.1] mb-3">{NEW_QUESTION.text}</div>
            <a href="#" className="inline-flex items-center gap-1 text-[17px] text-brown-mid dark:text-amber-500 font-semibold hover:text-brown-dark dark:hover:text-white">
              <span className="text-[19px]">›</span> تفصیل
            </a>
          </div>
        </div>

        {/* LEFT col — Selected questions */}
        <div className="bg-card-bg flex flex-col">
          <div className="h-14 flex items-center justify-center text-[23px] font-bold bg-brown-mid text-white">
            منتخب سوالات
          </div>
          {SELECTED_QUESTIONS.map((q) => (
            <div key={q.id} className="flex items-start gap-3 px-[18px] py-3.5 border-b border-site-border last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <div className="flex-1 text-right">
                <div className="text-[16px] text-text-primary leading-[1.75] mb-1">{q.title}</div>
                <a href="#" className="inline-flex items-center gap-1 text-[15px] text-brown-mid dark:text-amber-500 font-semibold hover:text-brown-dark dark:hover:text-white">
                  <span>›</span> تفصیل
                </a>
              </div>
              <div className="w-[62px] min-w-[62px] h-12 border border-site-border shrink-0 bg-gradient-to-br from-[#ddd5be] to-[#c8bfa8] dark:from-slate-700 dark:to-slate-800"/>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
