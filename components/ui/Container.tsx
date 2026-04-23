import type { HTMLAttributes } from "react";

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Width variant.
   * - `default`: standard content width (~1200px)
   * - `narrow`: prose / form width (~720px)
   * - `wide`: hero / gallery width (~1440px)
   */
  width?: "default" | "narrow" | "wide";
};

const widthClasses = {
  default: "max-w-6xl",
  narrow: "max-w-2xl",
  wide: "max-w-7xl",
} as const;

/**
 * Shared max-width wrapper with consistent horizontal padding.
 * Every section-level component should wrap its content in one.
 */
export function Container({
  width = "default",
  className = "",
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full px-6 md:px-8 ${widthClasses[width]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
