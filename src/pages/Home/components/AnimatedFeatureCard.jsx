import { COLORS } from '@/utils/themeColors';
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * AnimatedFeatureCard
 * Redesigned to be a static, premium academic feature card with no animations.
 */
export default function AnimatedFeatureCard({ icon: Icon, title, description, to }) {
    return (
        <div 
            style={{ borderColor: COLORS.border }}
            className="relative rounded-xl border bg-white p-5 h-full flex flex-col items-center text-center shadow-xs"
        >
            {/* Icon Container */}
            <div 
                style={{ backgroundColor: COLORS.secondary, color: COLORS.primary }}
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4 shrink-0"
            >
                <Icon className="w-5 h-5" />
            </div>

            {/* Title */}
            <h3 style={{ color: COLORS.primary }} className="text-sm font-bold mb-2 font-serif">{title}</h3>

            {/* Description */}
            <p className="text-textSecondary text-[11px] font-light leading-relaxed mb-4 flex-grow">{description}</p>

            {/* Action Link */}
            <Link
                to={to}
                style={{ color: COLORS.primary }}
                className="mt-auto inline-flex items-center gap-1 text-[11px] font-bold hover:text-accent transition-colors"
            >
                مزید جانیں <ArrowLeft className="w-3 h-3 text-accent" />
            </Link>
        </div>
    );
}
