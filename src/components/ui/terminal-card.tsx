
import * as React from "react";
import { cn } from "@/lib/utils";

const TerminalCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'cyberpunk' | 'tactical';
    glowing?: boolean;
  }
>(({ className, variant = 'default', glowing = false, ...props }, ref) => {
  const variants = {
    default: 'bg-slate-900/90 border-cyan-500/30',
    cyberpunk: 'bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/50',
    tactical: 'bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/50'
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border backdrop-blur-sm text-white transition-all duration-300",
        variants[variant],
        glowing && "shadow-[0_0_20px] shadow-cyan-500/30",
        className
      )}
      {...props}
    />
  );
});
TerminalCard.displayName = "TerminalCard";

const TerminalHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 p-4 border-b border-cyan-500/20 relative",
      className
    )}
    {...props}
  >
    {/* Terminal window controls */}
    <div className="absolute top-2 right-2 flex space-x-1">
      <div className="w-2 h-2 rounded-full bg-red-500/60"></div>
      <div className="w-2 h-2 rounded-full bg-yellow-500/60"></div>
      <div className="w-2 h-2 rounded-full bg-green-500/60"></div>
    </div>
  </div>
));
TerminalHeader.displayName = "TerminalHeader";

const TerminalTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-cyan-400 font-mono",
      "before:content-['$_'] before:text-green-400 before:mr-2",
      className
    )}
    {...props}
  >
    {children}
  </h3>
));
TerminalTitle.displayName = "TerminalTitle";

const TerminalContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 pt-0 font-mono", className)} {...props} />
));
TerminalContent.displayName = "TerminalContent";

export { TerminalCard, TerminalHeader, TerminalTitle, TerminalContent };
