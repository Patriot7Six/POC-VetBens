import { cn } from "@/lib/utils";
import { forwardRef } from "react";

// ── Badge ─────────────────────────────────────────────────────────────────────
type BadgeVariant =
  | "navy"
  | "gold"
  | "free"
  | "pro"
  | "elite"
  | "success"
  | "warning"
  | "danger"
  | "outline";

const badgeVariants: Record<BadgeVariant, string> = {
  navy:    "bg-navy-800 text-navy-200 border border-navy-700",
  gold:    "bg-gold-500/15 text-gold-400 border border-gold-500/30",
  free:    "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  pro:     "bg-gold-500/20 text-gold-300 border border-gold-600/40",
  elite:   "bg-purple-500/15 text-purple-300 border border-purple-500/30",
  success: "bg-emerald-500/15 text-emerald-400",
  warning: "bg-gold-500/15 text-gold-400",
  danger:  "bg-red-500/15 text-red-400",
  outline: "border border-navy-600 text-navy-300",
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({
  variant = "navy",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        badgeVariants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// ── Input ─────────────────────────────────────────────────────────────────────
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  label?:  string;
  error?:  string;
  hint?:   string;
  prefix?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, prefix, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-navy-200 mb-1.5"
          >
            {label}
            {props.required && <span className="text-gold-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400">
              {prefix}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-lg border bg-navy-800 px-4 py-3 text-navy-50",
              "placeholder:text-navy-500",
              "focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500",
              "transition-all duration-200",
              error
                ? "border-red-500/60"
                : "border-navy-700 hover:border-navy-600",
              prefix && "pl-10",
              className,
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
        {hint && !error && (
          <p className="mt-1.5 text-xs text-navy-400">{hint}</p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

// ── Textarea ──────────────────────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?:  string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-navy-200 mb-1.5"
          >
            {label}
            {props.required && <span className="text-gold-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-lg border bg-navy-800 px-4 py-3 text-navy-50",
            "placeholder:text-navy-500 resize-none",
            "focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500",
            "transition-all duration-200",
            error
              ? "border-red-500/60"
              : "border-navy-700 hover:border-navy-600",
            className,
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
        {hint && !error && (
          <p className="mt-1.5 text-xs text-navy-400">{hint}</p>
        )}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

// ── Select ────────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?:   string;
  error?:   string;
  options:  { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-navy-200 mb-1.5"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-lg border bg-navy-800 px-4 py-3 text-navy-50",
            "focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500",
            "transition-all duration-200 cursor-pointer",
            error
              ? "border-red-500/60"
              : "border-navy-700 hover:border-navy-600",
            className,
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-navy-800">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      </div>
    );
  },
);
Select.displayName = "Select";

// ── Section label ─────────────────────────────────────────────────────────────
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-7 h-0.5 bg-gold-500" />
      <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-gold-500">
        {children}
      </span>
      <div className="w-7 h-0.5 bg-gold-500" />
    </div>
  );
}

// ── Divider ───────────────────────────────────────────────────────────────────
export function GoldDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-10 h-0.5 bg-gradient-to-r from-gold-500 to-gold-700",
        className,
      )}
    />
  );
}

// ── Loading spinner ───────────────────────────────────────────────────────────
export function Spinner({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-8 w-8" };
  return (
    <svg
      className={cn("animate-spin text-gold-500", sizes[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}