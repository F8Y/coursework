import { Header } from "@widgets/index";
import { Footer } from "@widgets/index";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    );
};