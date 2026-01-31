import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/main-layout';
import { DashboardPage, ClientsListPage, ClientDetailPage } from '@pages/index';

export const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/clients" element={<ClientsListPage />} />
                <Route path="/clients/:id" element={<ClientDetailPage />} />
            </Route>
        </Routes>
    );
};