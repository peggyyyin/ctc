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
      "rounded-lg border-white bg-white text-black shadow-lg flex flex-col justify-between", // Flexbox ensures spacing
      className
    )}
    style={{
      width: "85vw", // 85% of viewport width
      maxWidth: "900px", // Prevents it from being too wide on large screens
      minHeight: "80vh", // Ensures a minimum height but grows if needed
      display: "flex",
      flexDirection: "column",
      margin: "auto", // Centers it horizontally
      backgroundColor: "white",
    }}
    {...props}
  />
));
Card.displayName = "Card";

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

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-600", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-5xl flex-grow text-white text-center text-lg font-semibold", //leading-none tracking-tight text-white text-center
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
    className={cn("flex-grow p-6 space-y-4 overflow-auto", className)} // flex-grow makes it fill available space  h1
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
    className={cn("flex items-center justify-between p-4 mt-auto", className)}
    {...props}
    style={{
      color: "white" }}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardContent, CardDescription};
