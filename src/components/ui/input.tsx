
import * as React from "react"
import { cn } from "@/lib/utils"
import { CheckCircle, AlertCircle, Mail } from "lucide-react"

interface InputProps extends React.ComponentProps<"input"> {
  showValidation?: boolean
  validationState?: 'valid' | 'invalid' | null
  validationMessage?: string
  showEmailSuggestions?: boolean
  onEmailSuggestionSelect?: (suggestion: string) => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    showValidation = false,
    validationState = null,
    validationMessage = '',
    showEmailSuggestions = false,
    onEmailSuggestionSelect,
    ...props 
  }, ref) => {
    const [emailSuggestions, setEmailSuggestions] = React.useState<string[]>([])
    const [showSuggestions, setShowSuggestions] = React.useState(false)
    
    const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com']

    const generateEmailSuggestions = (value: string) => {
      if (!value.includes('@') || !showEmailSuggestions) return []
      
      const [username, domain] = value.split('@')
      if (!domain || domain.length === 0) return []
      
      return commonDomains
        .filter(d => d.toLowerCase().startsWith(domain.toLowerCase()) && d !== domain.toLowerCase())
        .slice(0, 2)
        .map(d => `${username}@${d}`)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      
      if (type === 'email' && showEmailSuggestions) {
        const suggestions = generateEmailSuggestions(value)
        setEmailSuggestions(suggestions)
        setShowSuggestions(suggestions.length > 0)
      }
      
      if (props.onChange) {
        props.onChange(e)
      }
    }

    const handleSuggestionClick = (suggestion: string) => {
      setShowSuggestions(false)
      setEmailSuggestions([])
      
      if (onEmailSuggestionSelect) {
        onEmailSuggestionSelect(suggestion)
      }
    }

    const getValidationIcon = () => {
      switch (validationState) {
        case 'valid':
          return <CheckCircle className="w-4 h-4 text-green-500" />
        case 'invalid':
          return <AlertCircle className="w-4 h-4 text-red-500" />
        default:
          return null
      }
    }

    const getBorderColor = () => {
      switch (validationState) {
        case 'valid':
          return 'border-green-200 focus:border-green-400'
        case 'invalid':
          return 'border-red-200 focus:border-red-400'
        default:
          return 'border-gray-200 focus:border-blue-400'
      }
    }

    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-lg border bg-white px-4 py-2 text-sm transition-colors",
            "placeholder:text-gray-400",
            "focus:outline-none focus:ring-0",
            "disabled:cursor-not-allowed disabled:opacity-50",
            getBorderColor(),
            showValidation && validationState && "pr-10",
            className
          )}
          ref={ref}
          onChange={handleInputChange}
          onBlur={() => setShowSuggestions(false)}
          {...props}
        />
        
        {/* Validation Icon */}
        {showValidation && validationState && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {getValidationIcon()}
          </div>
        )}
        
        {/* Email Suggestions */}
        {showSuggestions && emailSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-100 rounded-lg shadow-lg">
            {emailSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2 first:rounded-t-lg last:rounded-b-lg"
              >
                <Mail className="w-3 h-3 text-gray-400" />
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        )}
        
        {/* Validation Message */}
        {showValidation && validationMessage && (
          <div className={cn(
            "mt-1 text-xs",
            validationState === 'valid' && "text-green-600",
            validationState === 'invalid' && "text-red-600"
          )}>
            {validationMessage}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
