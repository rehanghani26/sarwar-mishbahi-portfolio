import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

/**
 * AnimatedFeatureCard
 * A small, compact card with a continuously rotating gradient "ring" border.
 * The border is built by layering a rotating conic-gradient behind a white
 * inner panel that sits 1.5px inset from the wrapper — the gap is what
 * reveals the gradient as a thin animated border.
 *
 * Props:
 *  - icon: lucide-react icon component
 *  - title: string
 *  - description: string
 *  - to: route for the "Learn More" link
 *  - index: used to stagger the entrance animation across a grid
 */
export default function AnimatedFeatureCard({ icon: Icon, title, description, to, index = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.45, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -3 }}
            className="relative rounded-xl p-[1.5px] overflow-hidden isolate group"
        >
            {/* Rotating gradient ring (the animated border) */}
            <motion.div
                aria-hidden="true"
                className="absolute -inset-[60%] opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                    background:
                        'conic-gradient(from 0deg, transparent 0deg, #D4AF37 40deg, #B08D57 80deg, transparent 130deg, transparent 360deg)',
                }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 5.5, ease: 'linear' }}
            />

            {/* Static faint base ring so the border reads even between gradient sweeps */}
            <div className="absolute inset-0 rounded-xl ring-1 ring-[#E5D8CA]" aria-hidden="true" />

            {/* Card body */}
            <div className="relative z-10 bg-white rounded-[10px] p-4 h-full flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-full bg-[#F5EEE5] text-[#1F3A5F] flex items-center justify-center mb-3 transition-colors duration-300 group-hover:bg-[#1F3A5F] group-hover:text-white">
                    <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#1F3A5F] mb-1.5 font-serif">{title}</h3>
                <p className="text-[#7B654D] text-[11px] font-light leading-relaxed mb-3">{description}</p>
                <Link
                    to={to}
                    className="mt-auto inline-flex items-center gap-1 text-[11px] font-bold text-[#1F3A5F] hover:text-[#B08D57] transition-colors"
                >
                    مزید جانیں <ArrowLeft className="w-3 h-3" />
                </Link>
            </div>
        </motion.div>
    );
}