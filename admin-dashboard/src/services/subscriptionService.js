import api from "../utils/api";

const subscriptionService = {

    // Fetch all subscription plans
    getSubscription: async () => {
        try {
            const res = await api.get('/api/settings/subscription/pricing');  // Here we to put the api endpoint for fetching subscription plans
            console.log("Get Pricing Response:", res.data);
            return res.data
            

        } catch (error) {
            console.log("Get Pricing Error", error.response?.data || error.message)
            throw error;
        }
    },

    // Update subscription plans 
     updateSubscription: async (data) => {
    try {
      const res = await api.post(
        "/api/settings/subscription/pricing",  // Here we to put the api endpoint for updating subscription plans
        data
      );

      return res.data;
    } catch (error) {
      console.error("Update Pricing Error:", error.response?.data || error.message);
      throw error;
    }
  },
};


export default subscriptionService;