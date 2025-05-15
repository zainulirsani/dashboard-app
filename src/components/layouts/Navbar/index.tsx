import { useEffect, useState } from 'react';
import styles from "./navbar.module.css";
import Image from 'next/image';
import nookies from 'nookies';
import Link from 'next/link';

type NavbarProps = {
  toggleSidebar: () => void;
};

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const [userName, setUserName] = useState<string>("");
  const [Profile, setProfile] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      const cookies = nookies.get(null);
      const token = cookies.access_token;

      if (!token) return;

      try {
        const res = await fetch("http://127.0.0.1:8000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUserName(data.result.name);
          setProfile(data.result.profilePic);
        }
      } catch (error) {
        console.error("Gagal mengambil data user", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <nav className="navbar navbar-expand-lg my-2" style={{ backgroundColor: '#f8f9fc' }}>
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Tombol Sidebar */}
        <button
          type="button"
          className="btn p-0 border-0"
          aria-label="Toggle Sidebar"
          onClick={toggleSidebar}
        >
          <i className="fa-solid fa-bars fs-5"></i>
        </button>

        {/* Profil User */}
        <div className={`d-flex align-items-center gap-4 ${styles.userProfile}`}>
          <span className={styles.userName}>{userName}</span>
          <Link href="/KelolaAkun">
            <Image
              src={`http://127.0.0.1:8000/users/${Profile}`}
              alt="Photo Profile"
              className={styles.avatar}
              width={40}
              height={40}
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
