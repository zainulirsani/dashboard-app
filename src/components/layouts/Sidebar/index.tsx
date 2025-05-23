import styles from "./sidebar.module.css";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";

type SidebarProps = {
  isActive: boolean;
  toggleSidebar: () => void;
};


const Sidebar = ({ isActive, toggleSidebar }: SidebarProps) => {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get("access_token");

    if (!token) {
      console.warn("Token tidak ditemukan");
      return;
    }

    axios.get("http://127.0.0.1:8000/api/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        const user = response.data;
        setUserRole(user.result.role); // pastikan `role` memang ada di response
      })
      .catch(error => {
        console.error("Gagal mengambil data user:", error);
      });
  }, []);
  const handleLogout = () => {
    Swal.fire({
      title: "Logout",
      text: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Log Out",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        Cookies.remove("access_token");

        Swal.fire({
          icon: "success",
          title: "Logout Successful",
          text: "You will be redirected to the login page.",
          timer: 2000,
          showConfirmButton: false,
        });

        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      }
    });
  };

  const dashboardPath = userRole === "admin"
    ? "/admin"
    : userRole === "manager"
      ? "/manager"
      : userRole === "kadiv"
        ? "/kadiv"
        : "/";
  return (
    <nav className={`${isActive ? "show" : "hide"}`}>
      {/* Tombol Close Sidebar (khusus mobile) */}
      <div className="d-flex justify-content-end m-3 d-block d-lg-none">
        <button
          type="button"
          aria-label="Close"
          className="btn p-0 border-0 fs-4"
          onClick={toggleSidebar}
        >
          <i className="fas fa-close"></i>
        </button>
      </div>

      {/* Logo */}
      <div className="d-flex justify-content-center mt-md-5 mb-5">
        <Image src="/images/images.png" alt="Logo" width="150" height="50" />
      </div>

      {/* Menu Sidebar */}
      <div className="pt-2 d-flex flex-column gap-5">
        <div className={`${styles.menu} p-0`}>

          <Link
            href={dashboardPath}
            className={`${styles.itemMenu} ${router.pathname === dashboardPath ? styles.active : ""
              }`}
          >
            <i className={`${styles.icon} ${styles.icStats}`}></i>
            Overview
          </Link>

          {userRole === "admin" && (
            <Link
              href="/admin/users"
              className={`${styles.itemMenu} ${router.pathname === "/admin/users" ? styles.active : ""}`}
            >
              <i className={`${styles.icon} ${styles.icPerson}`}></i>
              User Data
            </Link>
          )}
        </div>

        <div className={styles.menu}>
          <p>Others</p>
          <Link href="/settings" className={styles.itemMenu}>
            <i className={`${styles.icon} ${styles.icSettings}`}></i>
            Settings
          </Link>
          <a role="button" className={styles.itemMenu} onClick={handleLogout}>
            <i className={`${styles.icon} ${styles.icLogout}`}></i>
            Logout
          </a>
        </div>
      </div>

    </nav>
  );
};

export default Sidebar;
