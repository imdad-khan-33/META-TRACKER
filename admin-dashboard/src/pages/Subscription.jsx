import { useEffect, useState } from "react";
import { Modal, Input, Button } from "antd";
import subscriptionService from "../services/subscriptionService";

const Subscription = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [newPrice, setNewPrice] = useState("");

  //  Fetch subscriptions
  const fetchPlans = async () => {
    try {
      const data = await subscriptionService.getSubscription();

      const formatted = [
        { name: "Starter", key: "starter", price: data.starter },
        { name: "Pro", key: "pro", price: data.pro },
      ];

      setPlans(formatted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const openModal = (plan) => {
    setSelectedPlan(plan);
    setNewPrice(plan.price);
    setIsModalOpen(true);
  };

  //  Update (row-based UI but sends BOTH values)
  const handleUpdate = async () => {
    let updated = {
      starter: plans.find((p) => p.key === "starter")?.price,
      pro: plans.find((p) => p.key === "pro")?.price,
    };

    updated[selectedPlan.key] = Number(newPrice);

    try {
      await subscriptionService.updateSubscription(updated);

      setPlans((prev) =>
        prev.map((p) =>
          p.key === selectedPlan.key ? { ...p, price: Number(newPrice) } : p,
        ),
      );

      setIsModalOpen(false);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 md:mb-12">
        Subscriptions
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white ">
            <thead className="border border-gray-300 ">
              <tr>
                <th className="py-3 px-4 text-left">Plan</th>
                <th className="py-3 px-4 text-left">Price</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {plans.map((plan, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{plan.name}</td>
                  <td className="py-3 px-4">${plan.price}</td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => openModal(plan)}
                      className="bg-blue-500 text-white px-2 py-1 sm:px-3 sm:py-1.5 text-sm sm:text-base rounded hover:bg-blue-600"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        width="90%"
        style={{ maxWidth: "500px" }}
        title={`Update ${selectedPlan?.name}`}
        open={isModalOpen}
        centered
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleUpdate}>
            Update
          </Button>,
        ]}
      >
        <label className="text-sm sm:text-base text-gray-600">Please Enter your new Price</label>
        <Input
        style={{marginTop: "8px"}}
          type="number"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          placeholder="Enter new price"
        />
      </Modal>
    </div>
  );
};

export default Subscription;
