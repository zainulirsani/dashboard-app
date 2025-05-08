import React, { useState, useEffect, useRef } from "react";
import styles from "@/styles/arcare.module.scss";
import DateRangeInput from "@/components/elements/Daterange/Daterange";
import { ArcareType } from "@/types/arcare.type";
import $ from "jquery";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
import "datatables.net";
import "datatables.net-responsive";

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


  useEffect(() => {
    if (!tableRef.current) return;

    const tableElement = $(tableRef.current);
    let dataTable: any;

    if (($.fn.DataTable as any).isDataTable("#dataTable")) {
      dataTable = tableElement.DataTable();
      dataTable.clear().destroy();
    }
    
    return () => {
      if (dataTable) {
        dataTable.destroy();
      }
    };
  }, [filteredTickets]);

  // trigger ulang datatables jika filtered berubah


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
        <div className="card-body">
          <table ref={tableRef} className="table table-striped table-hover nowrap w-100">
            <thead className="table-light text-center">
              <tr>
                <th>No</th>
                <th>Satuan Kerja</th>
                <th>Total Tiket</th>
                <th>Dikerjakan</th>
                <th>Selesai</th>
                <th>Pending</th>
                <th>Dibatalkan</th>
                <th>Total Nominal</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets?.map((ticket, index) => (
                <tr key={index}>
                  <td className="text-center">{index + 1}</td>
                  <td>{ticket.nama_satker}</td>
                  <td className="text-center">{ticket.total_tiket}</td>
                  <td className="text-center">{ticket.dikerjakan}</td>
                  <td className="text-center">{ticket.selesai}</td>
                  <td className="text-center">{ticket.pending}</td>
                  <td className="text-center">{ticket.dibatalkan}</td>
                  <td className="text-end">
                    {ticket.total_nominal
                      ? Number(ticket.total_nominal).toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        })
                      : "Rp0"}
                  </td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-primary border-0">
                      <i className="fas fa-info-circle me-1"></i> Detail
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTickets?.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center">Tidak ada data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ArcareView;
