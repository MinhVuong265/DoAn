// Nút bấm dùng chung - hỗ trợ nhiều variants
export default function Button({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  ...props 
}) {
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const baseStyle = 'rounded font-medium transition disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? '⏳ ...' : children}
    </button>
  );
}
