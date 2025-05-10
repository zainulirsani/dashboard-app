import React, { useState, useEffect, useRef } from "react";
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
  const tableRef = useRef<HTMLTableElement>(null);
  const summaryCards = [
    { title: "Total Ticket", value: data.totalTiket || 0, icon: "fas fa-ticket" },
    { title: "Ticket Menunggu", value: data.menunggu || 0, icon: "fas fa-ticket-alt" },
    { title: "Ticket On Process", value: data.proses || 0, icon: "fas fa-cogs" },
    { title: "Pending", value: data.pending || 0, icon: "fas fa-clock" },
    { title: "Ticket Selesai", value: data.selesai || 0, icon: "fas fa-check-circle" },
    { title: "Ticket Dibatalkan", value: data.batal || 0, icon: "fas fa-times-circle" },
  ];

  const [filteredTickets, setFilteredTickets] = useState<ArcareType[]>(data.tiket);
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null,
  });

  const handleDateChange = (range: { startDate: string; endDate: string }) => {
    const start = range.startDate ? new Date(range.startDate) : null;
    const end = range.endDate ? new Date(range.endDate) : null;

    setDateRange({ startDate: start, endDate: end });

    if (start && end) {
      const filtered = data.tiket.filter((ticket) => {
        const ticketDate = new Date(ticket.tanggal_dibuat);
        return ticketDate >= start && ticketDate <= end;
      });
      setFilteredTickets(filtered);
    } else {
      setFilteredTickets(data.tiket);
    }
  };

  return (
    <section className="p-3">
      <header className={`${styles.header} d-flex justify-content-between`}>
        <h3 className={styles.header__h3}>ArCare</h3>
      </header>

      <div className="row px-1 gap-4 justify-content-center mb-3">
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
            <DateRangeInput onDateChange={handleDateChange} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArcareView;
