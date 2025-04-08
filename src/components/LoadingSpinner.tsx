interface LoadingSpinnerProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    color?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'error';
    className?: string;
    fullScreen?: boolean;
}

function LoadingSpinner({
    size = 'md',
    color = 'primary',
    className = '',
    fullScreen = false,
}: LoadingSpinnerProps) {
    const sizeMap = {
        xs: 'h-4 w-4',
        sm: 'h-6 w-6',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16'
    };

    const colorMap = {
        primary: 'border-primary',
        secondary: 'border-secondary',
        accent: 'border-accent',
        neutral: 'border-gray-400',
        info: 'border-blue-500',
        success: 'border-green-500',
        warning: 'border-yellow-500',
        error: 'border-red-500'
    };

    return (
        <div className={`flex items-center justify-center ${fullScreen ? 'fixed inset-0 h-screen w-screen bg-white/80 z-50' : 'min-h-[200px]'}`}>
            <div className={`animate-spin rounded-full ${sizeMap[size]} border-4 border-t-transparent ${colorMap[color]} ${className}`} />
        </div>
    );
}

export default LoadingSpinner;