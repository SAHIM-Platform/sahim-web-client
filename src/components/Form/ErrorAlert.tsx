interface ErrorAlertProps {
  message: string;
  variant?: 'default' | 'inline';
  addMarginBottom?: boolean;
  addMarginTop?: boolean;
}

function ErrorAlert({ message, variant = 'default', addMarginBottom = false, addMarginTop = true }: ErrorAlertProps) {
  if (!message) return null;

  if (variant === 'inline') {
    return (
      <div className="flex items-center mt-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-red-500 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-red-600 text-xs font-medium">
          {message}
        </span>
      </div>
    );
  }

  return (
    <div className={`p-3 bg-red-50 border border-red-200 rounded-md ${addMarginBottom ? 'mb-4' : ''} ${addMarginTop ? 'mt-4' : ''}`}>
      <div className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-red-500 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-red-600 text-sm font-medium">
          {message}
        </span>
      </div>
    </div>
  );
};

export default ErrorAlert;
