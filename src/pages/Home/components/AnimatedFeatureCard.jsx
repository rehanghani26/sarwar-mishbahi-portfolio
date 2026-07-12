import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { COLORS } from "@/utils/themeColors";

export default function AnimatedFeatureCard({
  icon: Icon,
  title,
  description,
  to,
}) {
  return (
    <Link to={to} className="group block h-full">
      <div
        style={{
          borderColor: COLORS.border,
        }}
        className="
          relative
          h-full
          overflow-hidden
          rounded-2xl
          border
          bg-white
          p-6
          text-center
          shadow-sm
          transition-all
          duration-300
          hover:-translate-y-2
          hover:shadow-2xl
        "
      >
        {/* Decorative Background */}
        <div
          style={{
            background: COLORS.primary,
          }}
          className="
            absolute
            -top-8
            -right-8
            h-28
            w-28
            rounded-full
            opacity-[0.05]
          "
        />

        {/* Icon */}
        <div
          style={{
            backgroundColor: COLORS.secondary,
            color: COLORS.primary,
            borderColor: COLORS.border,
          }}
          className="
            relative
            mx-auto
            mb-5
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            border
            shadow-md
            transition-all
            duration-300
            group-hover:scale-110
            group-hover:rotate-3
          "
        >
          <Icon className="h-7 w-7" />
        </div>

        {/* Title */}
        <h3
          style={{ color: COLORS.primary }}
          className="
            mb-3
            text-lg
            font-bold
            leading-relaxed
          "
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className="
            text-sm
            leading-7
            text-gray-600
            min-h-[85px]
          "
        >
          {description}
        </p>

        {/* Divider */}
        <div
          style={{ backgroundColor: COLORS.border }}
          className="mx-auto my-5 h-px w-14"
        />

        {/* Button */}
        <div
          style={{
            color: COLORS.primary,
          }}
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            font-semibold
            transition-all
            duration-300
            group-hover:gap-3
          "
        >
          مزید جانیں
          <ArrowLeft className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}