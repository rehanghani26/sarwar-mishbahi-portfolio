import React from 'react';
import { Play, Video, Music, Calendar } from 'lucide-react';
import useTranslate from '../hooks/useTranslate';

export default function LectureCard({ lecture, onPlay }) {
  const { title, description, category, videoUrl, thumbnail, publishDate } = lecture;
  const { t, isUrdu } = useTranslate();

  const formattedDate = new Date(publishDate).toLocaleDateString(isUrdu ? 'ur-PK' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const getMediaIcon = (colorClass = "text-[#B08D57]") => {
    switch (category) {
      case 'Audio Lectures':
      case 'Bayan Recordings':
        return <Music className={`w-4 h-4 ${colorClass}`} />;
      default:
        return <Video className={`w-4 h-4 ${colorClass}`} />;
    }
  };

  const getYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getThumbnailUrl = () => {
    if (thumbnail) return thumbnail;
    
    // Auto generate YouTube thumbnail if YouTube link is detected
    const ytId = getYoutubeId(videoUrl);
    if (ytId) {
      return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    }

    return 'https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&q=80&w=800';
  };

  return (
    <div className="premium-card shadow-sm overflow-hidden flex flex-col h-full group text-start">
      
      {/* Thumbnail with Play Overlay */}
      <div className="relative h-44 w-full bg-slate-800 shrink-0 overflow-hidden">
        <img
          src={getThumbnailUrl()}
          alt={title}
          className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/35 transition-all">
          <button
            onClick={() => onPlay(lecture)}
            className="w-12 h-12 rounded-full bg-[#1F3A5F] hover:bg-[#162C49] text-white flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 focus:outline-none"
            aria-label="Play Lecture"
          >
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </button>
        </div>

        {/* Media Type Badge */}
        <div className="absolute bottom-3 left-3 bg-[#E5D8CA] text-[#7B654D] text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
          {getMediaIcon("text-[#7B654D]")}
          {t(category)}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-grow">
        
        {/* Date */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2 justify-start">
          <Calendar className="w-3.5 h-3.5 text-[#B08D57]" />
          {formattedDate}
        </div>

        {/* Title */}
        <h3 className="text-md font-bold text-slate-900 group-hover:text-[#1F3A5F] transition-colors leading-snug mb-2 font-serif line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-[#2C2C2C] text-xs font-light leading-relaxed line-clamp-2">
          {description}
        </p>

        {/* Play Link Actions */}
        <div className="mt-auto pt-3 flex items-center justify-between border-t border-slate-100">
          <button
            onClick={() => onPlay(lecture)}
            className="text-xs font-bold text-[#1F3A5F] hover:text-[#B08D57] transition-colors"
          >
            {t('Watch/Listen Now')}
          </button>
          
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-slate-500 hover:text-slate-700 underline"
          >
            {t('Open Original Link')}
          </a>
        </div>

      </div>

    </div>
  );
}
