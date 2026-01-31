import s from './footer.module.scss';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={s.footer}>
            <div className={s.container}>
                <p className={s.text}>
                    © {currentYear} BankCRM. Курсовая работа.
                </p>
            </div>
        </footer>
    );
};