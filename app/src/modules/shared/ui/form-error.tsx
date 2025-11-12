import * as React from "react"

import { cn } from "@/modules/shared/utils/cn"

export interface FormErrorProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  message?: React.ReactNode
  children?: React.ReactNode
}

export const FormError = React.forwardRef<HTMLParagraphElement, FormErrorProps>(
  ({ message, children, className, ...props }, ref) => {
    const content = message ?? children

    if (!content) {
      return null
    }

    return (
      <p
        ref={ref}
        role="alert"
        aria-live="polite"
        className={cn("text-sm text-destructive", className)}
        {...props}
      >
        {content}
      </p>
    )
  }
)

FormError.displayName = "FormError"
