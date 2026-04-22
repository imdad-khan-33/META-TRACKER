import { useEffect, useState } from "react";
import contactService from "../services/contactService";
import { MdDelete } from "react-icons/md";
import { Modal, Button } from "antd";

const ContactUsPage = () => {
  const [contacts, setContacts] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fetchContacts = async () => {
    try {
      const data = await contactService.getContacts();
      setContacts(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const openDeleteModal = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await contactService.deleteContact(selectedId);

      setContacts((prev) => prev.filter((item) => item._id !== selectedId));

      setIsModalOpen(false);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 w-full">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">Contact Messages</h2>

      {/* Desktop View - Table */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg md:rounded-xl shadow-md border border-gray-200">
        <table className="w-full text-xs sm:text-sm md:text-base">
          {/* Header */}
          <thead className="bg-gradient-to-r from-blue-50 to-blue-100 text-gray-700 border-b border-gray-200">
            <tr>
              <th className="py-3 md:py-4 px-3 md:px-6 text-left font-semibold">Name</th>
              <th className="py-3 md:py-4 px-3 md:px-6 text-left font-semibold">Email</th>
              <th className="py-3 md:py-4 px-3 md:px-6 text-left font-semibold">Message</th>
              <th className="py-3 md:py-4 px-3 md:px-6 text-center font-semibold">Action</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-200">
            {contacts.length > 0 ? (
              contacts.map((item) => (
                <tr key={item._id} className="hover:bg-blue-50 transition-colors">
                  <td className="py-3 md:py-4 px-3 md:px-6 font-medium text-gray-900">{item.name}</td>
                  <td className="py-3 md:py-4 px-3 md:px-6 text-gray-600">{item.email}</td>
                  <td className="py-3 md:py-4 px-3 md:px-6 text-gray-600 max-w-sm truncate">
                    {item.message}
                  </td>
                  <td className="py-3 md:py-4 px-3 md:px-6 text-center">
                    <button
                      onClick={() => openDeleteModal(item._id)}
                      className="inline-flex items-center justify-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition"
                    >
                      <MdDelete size={18} />
                      <span className="hidden sm:inline text-xs md:text-sm">Delete</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-500 text-sm md:text-base">
                  No messages found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet View - Card Layout */}
      <div className="md:hidden space-y-3 sm:space-y-4">
        {contacts.length > 0 ? (
          contacts.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-5 hover:shadow-lg transition-shadow"
            >
              <div className="space-y-3">
                {/* Name */}
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Name</p>
                  <p className="text-sm sm:text-base font-medium text-gray-900 mt-1">{item.name}</p>
                </div>

                {/* Email */}
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Email</p>
                  <p className="text-sm sm:text-base text-blue-600 break-all mt-1">{item.email}</p>
                </div>

                {/* Message */}
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Message</p>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">{item.message}</p>
                </div>

                {/* Action Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => openDeleteModal(item._id)}
                    className="inline-flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:text-red-700 hover:bg-red-100 px-3 sm:px-4 py-2 rounded-lg transition text-xs sm:text-sm font-medium"
                  >
                    <MdDelete size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
            <p className="text-gray-500 text-sm">No messages found</p>
          </div>
        )}
      </div>

      <Modal
        title="Confirm Delete"
        open={isModalOpen}
        centered
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="delete" danger type="primary" onClick={handleDelete}>
            Delete
          </Button>,
        ]}
      >
        <p>Are you sure you want to delete this message?</p>
      </Modal>
    </div>
  );
};

export default ContactUsPage;
