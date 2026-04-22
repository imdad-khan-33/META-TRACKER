import api from "../utils/api";

const contactService = {
  //  Fetch all contact messages
  getContacts: async () => {
    const res = await api.get("/api/contact-us");
    return res.data;   //  return only data
  },

  //  Delete contact message by ID
  deleteContact: async (id) => {
    const res = await api.delete(`/api/contact-us/${id}`); //  fixed URL
    return res.data;
  },
};

export default contactService;