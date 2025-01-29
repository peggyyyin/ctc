import * as React from "react";
import "../../app/globals.css";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-white text-black shadow-lg p-6 flex flex-col justify-between",
      className
    )}
    style={{
      width: "85vw", // 85% of viewport width
      maxWidth: "900px", // Prevents it from being too wide on large screens
      minHeight: "80vh", // Ensures a minimum height but grows if needed
      display: "flex",
      flexDirection: "column",
      margin: "auto", // Centers it horizontally
    }}
    {...props}
  />
));
Card.displayName = "Card";

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-4 rounded-t-lg", className)}
    style={{
      backgroundColor: "#152e65", // Dark Blue Header Background
      borderTopLeftRadius: "12px",
      borderTopRightRadius: "12px",
    }}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-white text-center",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-grow p-6 space-y-4 overflow-auto", className)} // flex-grow ensures content expands the card
    {...props}
  />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between p-4 border-t mt-auto", className)} // Ensures the footer sticks to the bottom
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardContent };
