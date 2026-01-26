
import { BrowserRouter } from 'react-router-dom';
import './styles/index.scss';

export const App = () => {
    return (
        <BrowserRouter>
            <div className="app-container">
                <h1>Bank Management System</h1>
                <p>Frontend initialized with TypeScript, Sass, and FSD.</p>
            </div>
        </BrowserRouter>
    );
};
