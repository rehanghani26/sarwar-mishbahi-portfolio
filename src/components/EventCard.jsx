import PropTypes from 'prop-types';
import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import useTranslate from '../hooks/useTranslate';

export default function EventCard({ event }) {
  const { title, description, eventDate, location, posterImage } = event;
  const { t, isUrdu } = useTranslate();

  const parsedDate = new Date(eventDate);
  const locale = isUrdu ? 'ur-PK' : 'en-US';
  const monthName = parsedDate.toLocaleDateString(locale, { month: 'short' }).toUpperCase();
  const dayNum = parsedDate.toLocaleString(locale, { day: 'numeric' });
  const yearNum = parsedDate.toLocaleString(locale, { year: 'numeric' });

  const formattedTime = parsedDate.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });

  const isUpcoming = parsedDate.getTime() > Date.now();
  const placeholderPoster = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800';

  return (
    <div className="premium-card shadow-sm overflow-hidden flex flex-col h-full md:flex-row group text-start">

      {/* Poster Image */}
      <div className="relative h-48 md:h-auto md:w-48 bg-slate-100 dark:bg-slate-900 shrink-0 overflow-hidden">
        <img
          src={posterImage || placeholderPoster}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Status Badge */}
        <div className={`absolute top-3 left-3 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm ${
          isUpcoming ? 'bg-[#E5D8CA] text-[#7B654D]' : 'bg-slate-500 text-white'
        }`}>
          {isUpcoming ? t('Upcoming') : t('Past Event')}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-grow md:flex-row items-stretch gap-4">

        {/* Date Stamp Block (Left Side on Desktop) */}
        <div className="flex flex-row md:flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[#E5D8CA] pb-4 md:pb-0 md:pr-4 shrink-0 text-center gap-4">
          <div className="w-12 md:w-16 h-12 md:h-16 rounded bg-[#E5D8CA] flex flex-col items-center justify-center text-[#1F3A5F]">
            <span className="text-lg font-bold leading-none">{dayNum}</span>
            <span className="text-xs font-bold uppercase tracking-wider mt-0.5">{monthName}</span>
          </div>
          <span className="text-xs text-slate-500 font-semibold">{yearNum}</span>
        </div>

        {/* Textual Details */}
        <div className="flex flex-col flex-grow justify-between">
          <div>
            {/* Title */}
            <h3 className="text-base font-bold text-slate-900 group-hover:text-[#1F3A5F] transition-colors leading-snug mb-4 font-serif">
              {title}
            </h3>

            {/* Description */}
            <p className="text-[#2C2C2C] text-sm font-light leading-relaxed line-clamp-3 mb-4">
              {description}
            </p>
          </div>

          {/* Time and Location markers */}
          <div className="flex flex-col gap-4 pt-4 border-t border-slate-100 text-sm text-slate-500 justify-start">
            <span className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#B08D57] shrink-0" />
              {formattedTime}
            </span>
            <span className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-[#B08D57] shrink-0 mt-0.5" />
              <span className="line-clamp-1">{location}</span>
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}

EventCard.propTypes = {
  event: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    eventDate: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    posterImage: PropTypes.string,
  }).isRequired,
};
