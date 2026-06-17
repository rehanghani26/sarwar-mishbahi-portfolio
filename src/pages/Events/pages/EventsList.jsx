import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, AlertCircle } from 'lucide-react';
import { fetchEvents } from '../../../store/slices/contentSlice';
import EventCard from '../../../components/EventCard';

export default function EventsList() {
  const dispatch = useDispatch();

  const { list: events, loading } = useSelector((state) => state.content.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const nowTime = Date.now();
  const upcomingEvents = events ? events.filter((e) => new Date(e.eventDate).getTime() > nowTime) : [];
  const pastEvents = events ? events.filter((e) => new Date(e.eventDate).getTime() <= nowTime) : [];

  return (
    <div className="bg-[#FAF9F5] dark:bg-slate-900 py-12 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header Title */}
        <div className="mb-12 text-center">
          <span className="text-xs font-bold text-[#8A6F52] dark:text-amber-500 uppercase tracking-widest font-serif block mb-1">Programs & Gatherings</span>
          <h1 className="text-3xl font-extrabold text-[#2F241C] dark:text-[#8A6F52] font-serif tracking-wide">Seminars & Announcements</h1>
          <p className="text-slate-550 dark:text-slate-400 text-sm font-light mt-2 max-w-md mx-auto">
            Stay informed about upcoming educational seminars, workshops, and weekly circles conducted by the scholar.
          </p>
        </div>

        {/* Content list Loader */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2F241C]"></div>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* Section 1: Upcoming Programs */}
            <div>
              <h2 className="text-lg font-bold text-[#2F241C] dark:text-[#8A6F52] font-serif mb-6 pb-2 border-b border-[#EAE3CF]/50 dark:border-slate-800 uppercase tracking-wider">
                Upcoming Events
              </h2>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-6">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="premium-card p-6 text-center text-slate-550 dark:text-slate-400 italic text-sm">
                  No upcoming gatherings scheduled. Check back soon.
                </div>
              )}
            </div>

            {/* Section 2: Past Gatherings */}
            {pastEvents.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-slate-450 dark:text-slate-400 font-serif mb-6 pb-2 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
                  Completed Programs
                </h2>
                <div className="space-y-6 opacity-75">
                  {pastEvents.map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
              </div>
            )}

            {/* Empty view case */}
            {(!events || events.length === 0) && (
              <div className="text-center py-16 premium-card">
                <Calendar className="w-12 h-12 text-[#8A6F52] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-700 dark:text-white font-serif">No Events Scheduled</h3>
                <p className="text-slate-550 dark:text-slate-400 text-xs mt-1">There are currently no events logged in the system.</p>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
