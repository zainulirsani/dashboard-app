import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import styles from "./AppShell.module.css";

type AppShellProps = {
    children: React.ReactNode;
};

const disableNavbar = ["/", "/auth/login","/404"];

const AppShell = ({ children }: AppShellProps) => {
    const { pathname } = useRouter();
    const [isSidebarActive, setIsSidebarActive] = useState(true);

    // Auto close sidebar saat layar kecil
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 1024) {
                setIsSidebarActive(false);
            } else {
                setIsSidebarActive(true);
            }
        };

        handleResize(); // Panggil saat pertama render
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarActive((prev) => !prev);
    };

    const isAuthPage = disableNavbar.includes(pathname);

    return (
        <div className={styles.appShell}>
            {!isAuthPage && (
                <aside className={`${styles.sidebar} ${isSidebarActive ? styles.show : styles.hide}`}>
                    <Sidebar isActive={isSidebarActive} toggleSidebar={toggleSidebar} />
                </aside>

            )}

            <main className={`${styles.content} ${!isSidebarActive ? styles.contentActive : ''}`}>
                {!isAuthPage && <Navbar toggleSidebar={toggleSidebar} />}
                <div className={styles.mainContent}>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AppShell;
