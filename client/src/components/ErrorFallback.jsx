import { AlertTriangle } from "lucide-react";

export const ErrorFallback = ({
  title = "Something went wrong",
  message = "An error occurred. Please try again.",
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg border border-red-200">
      <IconComponent size={48} className="text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-red-800 mb-2">{title}</h3>
      <p className="text-red-700 text-center mb-4 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export const NetworkError = ({ onRetry }) => {
  return (
    <ErrorFallback
      title="Network Error"
      message="Unable to connect to the server. Please check your internet connection and try again."
      onRetry={onRetry}
    />
  );
};

export const NotFoundError = () => {
  return (
    <ErrorFallback
      title="Page Not Found"
      message="The page you're looking for doesn't exist or has been removed."
    />
  );
};

export default ErrorFallback;
