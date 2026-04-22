import api from "../utils/api";

const assignplanService = {
    assignPlan: async (workspaceId, planData) => {
        try {
            const res = await api.post(`/api/auth/platform/workspaces/${workspaceId}/assign-plan`, planData);
            return {
                success: true,
                data: res.data
            };
        } catch (error) {
            console.error('Error assigning plan:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default assignplanService;