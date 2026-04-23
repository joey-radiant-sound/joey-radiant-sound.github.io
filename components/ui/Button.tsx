import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

type AsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

type AsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "href"> & {
    href: string;
  };

type ButtonProps = AsButton | AsLink;

const base =
  "inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-500 text-white hover:bg-brand-600 focus-visible:ring-offset-surface",
  secondary:
    "bg-white text-ink ring-1 ring-inset ring-brand-500/20 hover:ring-brand-500/40",
  ghost: "text-ink hover:bg-surface-alt",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

function classesFor(variant: Variant, size: Size, className: string) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
}

/**
 * Primary button primitive. Renders as `<a>` via next/link when `href` is
 * provided, otherwise as a `<button>`.
 */
export function Button(props: ButtonProps) {
  if ("href" in props && props.href !== undefined) {
    const {
      variant = "primary",
      size = "md",
      className = "",
      children,
      href,
      ...rest
    } = props;
    return (
      <Link
        href={href}
        className={classesFor(variant, size, className)}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  const {
    variant = "primary",
    size = "md",
    className = "",
    children,
    ...rest
  } = props;
  return (
    <button className={classesFor(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
