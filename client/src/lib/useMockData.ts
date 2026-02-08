// Hook to use mock data when database is not available
import { mockPosts, mockCategories, mockCaravanRoutes, mockHeroSection, mockFeatureCards, mockTeamMembers } from './mockData';

export function useMockData() {
    const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

    return {
        useMock: USE_MOCK,
        mockPosts,
        mockCategories,
        mockCaravanRoutes,
        mockHeroSection,
        mockFeatureCards,
        mockTeamMembers,
    };
}
