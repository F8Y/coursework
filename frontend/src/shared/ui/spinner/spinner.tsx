import s from './spinner.module.scss';
import clsx from 'clsx';

type SpinnerSize = 'sm' | 'md' | 'lg';

interface SpinnerProps {
    size?: SpinnerSize;
    className?: string;
}

export const Spinner = ({ size = 'md', className }: SpinnerProps) => {
    return (
        <div className={clsx(s.spinner, s[`spinner--${size}`], className)} role="status">
            <span className="sr-only">Loading...</span>
        </div>
    );
};

// Full page loader
interface PageLoaderProps {
    text?: string;
}

export const PageLoader = ({ text = 'Loading...' }: PageLoaderProps) => {
    return (
        <div className={s.pageLoader}>
            <Spinner size="lg" />
            <p className={s.text}>{text}</p>
        </div>
    );
};
