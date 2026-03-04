import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import supportService from '../services/supportService';

const Support = () => {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });

  // Fetch contact submissions from API
  const fetchSubmissions = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const result = await supportService.getContactSubmissions(page);
      if (result.success) {
        const data = Array.isArray(result.submissions) ? result.submissions : [];
        setSubmissions(data);
        setPagination(result.pagination);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to load contact submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    setCurrentPage(page);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const total = pagination.totalPages;
    const current = currentPage;
    const maxVisible = 5;

    if (total <= maxVisible) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(2, current - 1);
      let end = Math.min(total - 1, current + 1);
      if (current <= 2) end = 4;
      if (current >= total - 1) start = total - 3;
      if (start > 2) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < total - 1) pages.push('...');
      pages.push(total);
    }
    return pages;
  };

  // Delete a submission
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) return;
    const result = await supportService.deleteContactSubmission(id);
    if (result.success) {
      fetchSubmissions(currentPage);
    } else {
      alert(result.message || 'Failed to delete submission');
    }
  };

  // Calculate stats from submissions
  const technicalCount = submissions.filter((s) => s.category?.toLowerCase() === 'technical').length;
  const errorCount = submissions.filter((s) => s.category?.toLowerCase() === 'error').length;
  const otherCount = submissions.filter((s) => !['technical', 'error'].includes(s.category?.toLowerCase())).length;

  const supportStats = [
    { 
      title: 'Technical Issues', 
      count: String(technicalCount), 
      subtitle: 'Active technical support requests',
      textColor: 'text-green-600'
    },
    { 
      title: 'Errors', 
      count: String(errorCount), 
      subtitle: 'System errors report',
      textColor: 'text-blue-600'
    },
    { 
      title: 'Other Inquiries', 
      count: String(otherCount), 
      subtitle: 'General feedbacks',
      textColor: 'text-purple-600'
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto">
      <h1 className="text-xl md:text-2xl lg:text-[28px] font-bold text-[#000000] mb-2">Support & Contact</h1>
      <p className="text-sm text-[#000000] mb-6">Manage your customer inquiries, feedbacks & technical issues.</p>
      
      {/* Support Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {supportStats.map((stat, index) => (
          <div 
            key={index} 
            className="p-6 rounded-lg border"
            style={{ backgroundColor: '#CDE5FB', borderColor: '#CDE5FB' }}
          >
            <h3 className="text-sm font-semibold text-[#000000] mb-2">{stat.title}</h3>
            <p className="text-4xl font-bold text-[#000000] mb-2">{stat.count}</p>
            <p className="text-[16px] font-medium leading-[24px] tracking-[0px] text-[#0AD966]">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Contact Submissions Table */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-[#000000] mb-4">Contact Submissions</h2>
        
        <div className="bg-white rounded-lg border border-[#D9EAFD] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-white">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#000000]">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-sm text-[#61698A]">
                      Loading submissions...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-sm text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : submissions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-sm text-[#61698A]">
                      No contact submissions found.
                    </td>
                  </tr>
                ) : (
                  submissions.map((submission) => (
                    <tr key={submission._id || submission.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 text-sm text-[#61698A]">{submission.name}</td>
                      <td className="py-4 px-4 text-sm text-[#61698A]">{submission.email}</td>
                      <td className="py-4 px-4 text-sm text-[#61698A]">{submission.category}</td>
                      <td className="py-4 px-4 text-sm text-[#61698A]">
                        {submission.date
                          ? new Date(submission.date).toLocaleDateString()
                          : new Date(submission.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setShowModal(true);
                            }}
                            className="px-3 py-1 bg-[#CDE5FB] cursor-pointer text-[#000000] text-xs font-medium rounded hover:bg-[#b0d5f8] transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDelete(submission._id || submission.id)}
                            className="px-3 py-1 bg-[#FBD2CD] cursor-pointer text-[#000000] text-xs font-medium rounded hover:bg-[#ffd0d0] transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination - Separated below the table */}
        {!loading && !error && submissions.length > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-between px-4 py-4 mt-4 bg-white rounded-lg border border-[#D9EAFD] shadow-sm gap-4">
              <div className="text-sm text-[#61698A]">
                Showing{' '}
                <span className="font-semibold text-[#000000]">
                  {(currentPage - 1) * pagination.limit + 1}
                </span>{' '}
                to{' '}
                <span className="font-semibold text-[#000000]">
                  {Math.min(currentPage * pagination.limit, pagination.total)}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-[#000000]">{pagination.total}</span> entries
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm font-medium text-[#61698A] bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {getPageNumbers().map((page, idx) =>
                    page === '...' ? (
                      <span key={`ellipsis-${idx}`} className="px-2 py-1.5 text-sm text-[#61698A]">
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1.5 text-sm font-medium rounded cursor-pointer transition-colors ${
                          currentPage === page
                            ? 'text-white bg-[#2E73E3] border border-[#2E73E3] hover:bg-[#2563EB]'
                            : 'text-[#61698A] bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="px-3 py-1.5 text-sm font-medium text-[#61698A] bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

      {/* View Submission Modal */}
      {showModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md relative animate-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-[#000000]">Submission Details</h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedSubmission(null);
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Name</p>
                <p className="text-sm text-[#000000] font-medium">{selectedSubmission.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Email</p>
                <p className="text-sm text-[#2E73E3] font-medium">{selectedSubmission.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Category</p>
                <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-[#CDE5FB] text-[#2E73E3]">
                  {selectedSubmission.category}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Message</p>
                <p className="text-sm text-[#61698A] bg-gray-50 rounded-lg p-3">{selectedSubmission.message}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Date</p>
                <p className="text-sm text-[#61698A]">
                  {selectedSubmission.date
                    ? new Date(selectedSubmission.date).toLocaleDateString()
                    : new Date(selectedSubmission.createdAt).toLocaleDateString()}
                </p>
              </div>
              {(selectedSubmission.imageUrl || selectedSubmission.imageFilename) && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Attachment</p>
                  <a
                    href={selectedSubmission.imageUrl || `https://api.track2gram.com/public/support-uploads/${selectedSubmission.imageFilename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={selectedSubmission.imageUrl || `https://api.track2gram.com/public/support-uploads/${selectedSubmission.imageFilename}`}
                      alt="Submission attachment"
                      crossOrigin="anonymous"
                      className="w-full max-h-60 object-contain rounded-lg border border-gray-200 bg-gray-50 cursor-pointer hover:opacity-90 transition-opacity"
                      onError={(e) => {
                        // Fallback: try IP-based URL if domain URL fails
                        const fallback = `${import.meta.env.VITE_API_BASE_URL}/public/support-uploads/${selectedSubmission.imageFilename}`;
                        if (e.target.src !== fallback) {
                          e.target.src = fallback;
                        }
                      }}
                    />
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedSubmission(null);
                }}
                className="px-4 py-2 bg-[#2E73E3] text-white text-sm font-medium rounded-lg hover:bg-[#2563EB] cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;
