// Thanh footer cố định
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">About</h3>
            <p className="text-gray-400">RecruitX - AI-Powered Recruitment Platform</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Services</h3>
            <ul className="text-gray-400 space-y-2">
              <li><a href="#" className="hover:text-white">Job Search</a></li>
              <li><a href="#" className="hover:text-white">Post Jobs</a></li>
              <li><a href="#" className="hover:text-white">CV Parser</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <p className="text-gray-400">Email: info@recruitx.com</p>
            <p className="text-gray-400">Phone: +84 123 456 789</p>
          </div>
        </div>
        <hr className="border-gray-700 mb-4" />
        <p className="text-center text-gray-400">&copy; 2026 RecruitX. All rights reserved.</p>
      </div>
    </footer>
  );
}
