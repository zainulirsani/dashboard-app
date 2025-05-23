import { useState} from "react";
import styles from "./dashboard.module.scss";
import { PerusahaanType } from "@/types/Perusahaan.type";
import Image from 'next/image';

const Dashboard = ({ perusahaans }: { perusahaans: PerusahaanType[] }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredPerusahaans = perusahaans.filter((perusahaan) =>
    perusahaan.nama_perusahaan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="p-3">
  <div className="row px-1 mb-2 gap-4 justify-content-end ms-4">
    <input
      type="text"
      placeholder="Search company system"
      className={`${styles.search} form-control mx-2`}
      value={searchTerm}
      onChange={handleSearch}
    />
  </div>
  <header className={`${styles.header} d-flex align-items-center justify-content-between`}>
    <h3 className={`${styles.header__h3} text-center flex-grow-1`}>Company System List</h3>
  </header>

  <div className="row px-2 mb-2 gap-4 justify-content-start ms-4">
    {filteredPerusahaans.map((perusahaan) => (
      <div key={perusahaan.id} className={`${styles.card} col-xl-2 col-12`}>
        <h2 className={styles.card__title}>{perusahaan.nama_perusahaan}</h2>
        <Image
          src={`http://127.0.0.1:8000/uploads/${perusahaan.logo}`}
          alt={`Logo of ${perusahaan.nama_perusahaan}`}
          className={styles.card__img}
          width={100}
          height={50}
        />
        <a href={`DetailPerusahaan/${perusahaan.slug}`} className={`${styles.card__btn} text-center`}>
          Details
        </a>
      </div>
    ))}
  </div>
</section>

  );
};

export default Dashboard;
