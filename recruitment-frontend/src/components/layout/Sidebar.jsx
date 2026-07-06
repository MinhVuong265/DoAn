// Sidebar bố cục cố định - hiển thị filters
export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 min-h-screen p-4 sticky top-16">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Filters</h2>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Location</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 w-4 h-4" />
              <span className="text-sm">Ha Noi</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 w-4 h-4" />
              <span className="text-sm">Ho Chi Minh</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 w-4 h-4" />
              <span className="text-sm">Da Nang</span>
            </label>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Job Type</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 w-4 h-4" />
              <span className="text-sm">Full-time</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 w-4 h-4" />
              <span className="text-sm">Part-time</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 w-4 h-4" />
              <span className="text-sm">Remote</span>
            </label>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Salary Range</h3>
          <input 
            type="range" 
            min="0" 
            max="100" 
            className="w-full" 
          />
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span>$0</span>
            <span>$100k+</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
