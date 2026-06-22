import React from 'react'
import { SITE } from '../data/siteData'

export default function TopBar() {
  return (
    <div className="bg-[#1E1E1E] h-11 flex items-center px-4 md:px-7 border-b border-[#2e2e2e] relative z-50 font-serif">
      <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between gap-2">

        {/* Date — right side (RTL default) */}
        <div className="flex items-center text-[#d0d0d0] text-[11px] sm:text-[13px] whitespace-nowrap overflow-hidden text-ellipsis">
          <span>{SITE.hijriDate}</span>
          <span className="mx-1.5 sm:mx-2 text-[#555]">·</span>
          <span>{SITE.gregDate}</span>
        </div>


        {/* Bismillah — absolute center */}
        <div className="absolute left-1/2 -translate-x-1/2 text-[#e8dfc8] text-[15px] sm:text-[17px] whitespace-nowrap hidden lg:block select-none">
          {SITE.bismillah}
        </div>

        {/* Actions — left side */}
        <div className="flex items-center mr-auto shrink-0">
          <button className="bg-[#2d2d2d] text-[#bbb] border-none border-l border-[#3a3a3a] px-3 sm:px-5 h-11 text-[12px] sm:text-[14px] hover:bg-[#3a3a3a] hover:text-white transition-colors">
            لاگ ان
          </button>
          <button className="bg-[#1F3A5F] text-white px-3 sm:px-4 h-11 text-[12px] sm:text-[14px] flex items-center gap-1 hover:bg-[#A08060] transition-colors">
            اردو <span className="text-[9px] sm:text-[10px]">▾</span>
          </button>
        </div>

      </div>
    </div>
  )
}
