import type React from "react"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <div className="relative min-h-screen w-full">
      <div
        className="fixed inset-0 w-[150%] h-[150%] -translate-x-[16.66%] -translate-y-[16.66%] z-0"
        style={{
          backgroundColor: "blue",
          // backgroundImage:
          //   'url("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-bzYOXCHEEgBRVxzK5gNilEQF0To4nc.png")',
          // backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

