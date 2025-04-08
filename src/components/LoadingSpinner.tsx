interface LoadingSpinnerProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    color?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'error';
    className?: string;
}

function LoadingSpinner({
    size = 'md',
    color = 'primary',
    className = '',
}: LoadingSpinnerProps) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <span className={`loading loading-spinner loading-${size} text-${color} ${className}`}></span>
        </div>
    );
};

export default LoadingSpinner;