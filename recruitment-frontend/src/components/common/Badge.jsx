// Badge hiển thị điểm số, trạng thái
export default function Badge({ 
  label, 
  value,
  variant = 'default',
  className = ''
}) {
  const variants = {
    default: 'bg-gray-200 text-gray-800',
    success: 'bg-green-200 text-green-800',
    warning: 'bg-yellow-200 text-yellow-800',
    danger: 'bg-red-200 text-red-800',
    info: 'bg-blue-200 text-blue-800',
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${variants[variant]} ${className}`}>
      {label && <span className="mr-2">{label}:</span>}
      {value}
    </span>
  );
}
