import * as React from "react";

export type CardProps = React.HTMLAttributes<HTMLDivElement>;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white shadow-sm",
        "p-4 sm:p-6",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

