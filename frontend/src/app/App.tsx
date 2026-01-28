
import { BrowserRouter } from 'react-router-dom';
import './styles/globals.scss';

export const App = () => {
    return (
        <BrowserRouter>
            <div>
                <h1>Bank Management System</h1>
                <p>Frontend initialized with TypeScript, Sass, and FSD.</p>
            </div>
        </BrowserRouter>
    );
};
