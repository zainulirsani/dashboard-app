import React, { useState, } from "react";
import styles from "@/styles/arcare.module.scss";
import DateRangeInput from "@/components/elements/Daterange/Daterange";
import { ArcareType } from "@/types/arcare.type";


interface Props {
  data: {
    totalTiket: number;
    menunggu: number;
    proses: number;
    pending: number;
    selesai: number;
    batal?: number;
    tiket: ArcareType[];
  };
}

const ArcareView: React.FC<Props> = ({ data }) => {
  const [showDateRange, setShowDateRange] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const summaryCards = [
    { title: "Total Ticket", value: data.totalTiket || 0, icon: "fas fa-ticket" },
    { title: "Ticket Menunggu", value: data.menunggu || 0, icon: "fas fa-ticket-alt" },
    { title: "Ticket On Process", value: data.proses || 0, icon: "fas fa-cogs" },
    { title: "Pending", value: data.pending || 0, icon: "fas fa-clock" },
    { title: "Ticket Selesai", value: data.selesai || 0, icon: "fas fa-check-circle" },
    { title: "Ticket Dibatalkan", value: data.batal || 0, icon: "fas fa-times-circle" },
  ];
  const handleDateChange = ({ startDate, endDate }: { startDate: string; endDate: string }) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };
  const toggleDateRange = () => {
    setShowDateRange(!showDateRange);
};
  return (
    <section className="p-3">
      <header className={`${styles.header} d-flex justify-content-between`}>
        <h3 className={styles.header__h3}>ArCare</h3>
      </header>
      <div className="row px-1 mb-2 gap-5 justify-content-end">
        <div style={{ position: 'relative', width: 'auto' }}>
          <div
            className={`${styles.search} d-flex align-items-center justify-content-end gap-2`}
            onClick={toggleDateRange}
            style={{ cursor: 'pointer' }}
          >
            <span>
              Pilih Tanggal:
              {startDate && endDate && (
                <> {new Date(startDate).toLocaleDateString('id-ID')} s.d. {new Date(endDate).toLocaleDateString('id-ID')}</>
              )}
            </span>
          </div>
          {showDateRange && (
            <div className={styles.datePickerWrapper}>
              <DateRangeInput
                onDateChange={handleDateChange}
                onDone={() => setShowDateRange(false)} // Tutup saat selesai pilih
              />
            </div>
          )}
        </div>
      </div>
      <div className="row col-12 px-1 gap-4 justify-content-center mb-3">
        {summaryCards.map((card, i) => (
          <div key={i} className={`${styles.mediumCard} col-xl-2 col-12 card`}>
            <div className={`${styles.mediumCard__cardContent} d-flex align-items-center justify-content-center`}>
              <div className={`${styles.mediumCard__cardContent__leftSection} text-center`}>
                <h2 className={styles.mediumCard__cardContent__leftSection__number}>{card.value}</h2>
              </div>
              <div className={`${styles.mediumCard__cardContent__rightSection} text-center`}>
                <i className={`${styles.mediumCard__cardContent__rightSection__icon} ${card.icon}`}></i>
              </div>
            </div>
            <p className={`${styles.mediumCard__description} text-center`}>{card.title}</p>
          </div>
        ))}
      </div>
      <div className={`${styles.card} mb-3`}>
        <div className={`${styles.card__cardHeader} chart d-flex justify-content-between align-items-center`}>
          <h6 className="card-title text-start text-white mb-0">Rekap Perbaikan</h6>
          <div className={`${styles.card__cardHeader__date} d-flex align-items-center gap-2`}>
           
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArcareView;
