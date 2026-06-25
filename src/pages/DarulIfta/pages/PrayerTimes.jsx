import React from 'react'
import PageContainer from '../../../components/PageContainer'
import { PRAYER_TIMES } from '../../../data/siteData'

export default function PrayerTimes() {
  return (
    <PageContainer
      title="نماز کے اوقات"
      subtitle="کراچی اور اس کے مضافات کے لیے یومیہ اوقاتِ نماز"
    >
      <div className="space-y-6">
        <div className="bg-[#3D2E1E] text-white p-5 rounded-sm text-center">
          <p className="text-[18px] font-bold">{PRAYER_TIMES.date}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
          {PRAYER_TIMES.times.map((p, idx) => (
            <div key={idx} className="bg-[#fdfcf9] border border-[#E5D8CA] p-5 rounded text-center hover:shadow-md transition-shadow">
              <span className="text-[32px] block mb-2">{p.icon}</span>
              <span className="text-[20px] font-bold text-[#3A2C23] block">{p.name}</span>
              <span className="text-[24px] font-mono text-[#B08D57] font-bold mt-1 block">{p.time}</span>
            </div>
          ))}
        </div>

        <div className="bg-[#fcfbf9] border-r-4 border-[#B08D57] p-5 leading-relaxed">
          <h4 className="text-[19px] font-bold text-[#3A2C23] mb-2">ضروری ہدایت برائے وقتِ سحر و افطار</h4>
          <p className="text-[15px] text-[#555]">
            احتیاط کا تقاضا یہ ہے کہ روزے کے معاملے میں سحری کا وقت ختم ہونے سے کم از کم 2 منٹ پہلے کھانے پینے سے ہاتھ روک لیا جائے، اور افطار کے وقت غروبِ آفتاب کا یقین ہونے کے بعد ہی روزہ افطار کیا جائے۔
          </p>
        </div>
      </div>
    </PageContainer>
  )
}
