import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '@/routes/app-routes';
import './styles/globals.scss';

export const App = () => {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
};
