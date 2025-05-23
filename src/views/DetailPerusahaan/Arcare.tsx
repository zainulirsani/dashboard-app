import React, { useEffect, useState, } from "react";
import styles from "@/styles/arcare.module.scss";
import DateRangeInput from "@/components/elements/Daterange/Daterange";
import { FaRegCalendarAlt } from 'react-icons/fa';
import { ArcareType, AssigmentPerTanggal, Ticket, TotalPerTanggal } from "@/types/arcare.type";
import dynamic from 'next/dynamic';
import DonutChartTeknisi from "@/components/elements/Chart/DonutChartTeknisi";
const DataTable = dynamic(() => import('react-data-table-component'), {
  ssr: false,
});

interface Props {
  data: ArcareType;
}

const ArcareView: React.FC<Props> = ({ data }) => {
  const [selectedTable, setSelectedTable] = useState<'total' | 'menunggu' | 'proses' | 'pending' | 'selesai' | 'batal'>('total');
  const [showDateRange, setShowDateRange] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [filteredDataTotal, setFilteredDataTotal] = useState<TotalPerTanggal[]>(data.totalTiket || []);
  const [filteredDataMenunggu, setFilteredDataMenunggu] = useState<TotalPerTanggal[]>(data.menunggu || []);
  const [filteredDataProses, setFilteredDataProses] = useState<TotalPerTanggal[]>(data.proses || []);
  const [filteredDataPending, setFilteredDataPending] = useState<TotalPerTanggal[]>(data.pending || []);
  const [filteredDataBatal, setFilteredDataBatal] = useState<TotalPerTanggal[]>(data.batal || []);
  const [filteredDataSelesai, setFilteredDataSelesai] = useState<TotalPerTanggal[]>(data.selesai || []);
  const [filteredAssigment, setFilteredAssigment] = useState<AssigmentPerTanggal[]>(data.assigment || []);
  const [filteredTicket, setFilteredTicket] = useState<Ticket[]>(data.ticket || []);
  const [filterText, setFilterText] = useState('');
  const [filteredItems, setFilteredItems] = useState<Ticket[]>(data.ticket || []);
  const [filteredItemsSelesai, setFilteredItemsSelesai] = useState<Ticket[]>(data.ticket || []);
  const [filteredItemsMenunggu, setFilteredItemsMenunggu] = useState<Ticket[]>(data.ticket || []);
  const [filteredItemsProses, setFilteredItemsProses] = useState<Ticket[]>(data.ticket || []);
  const [filteredItemsPending, setFilteredItemsPending] = useState<Ticket[]>(data.ticket || []);
  const [filteredItemsBatal, setFilteredItemsBatal] = useState<Ticket[]>(data.ticket || []);
  const handleDateChange = ({ startDate, endDate }: { startDate: string; endDate: string }) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };
  const toggleDateRange = () => {
    setShowDateRange(!showDateRange);
  };
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
  };
  useEffect(() => {
    if (data.totalTiket && data.totalTiket.length > 0) {
      // Ambil semua tahun dari data
      const years = data.totalTiket
        .map(item => new Date(item.tanggal).getFullYear())
        .filter(year => !isNaN(year));

      // Cari tahun terbesar
      const latestYear = Math.max(...years);

      // Set default start dan end date berdasarkan tahun terakhir
      const defaultStartDate = `${latestYear}-01-01`;
      const defaultEndDate = `${latestYear}-12-31`;

      setStartDate(defaultStartDate);
      setEndDate(defaultEndDate);
    }
  }, [data.totalTiket]);
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      const filteredTotal = data.totalTiket.filter((item: TotalPerTanggal) => {
        const tanggal = new Date(item.tanggal);
        return tanggal >= start && tanggal <= end;
      });

      const filteredMenunggu = data.menunggu.filter((item: TotalPerTanggal) => {
        const tanggal = new Date(item.tanggal);
        return tanggal >= start && tanggal <= end;
      });

      const filteredProses = data.proses.filter((item: TotalPerTanggal) => {
        const tanggal = new Date(item.tanggal);
        return tanggal >= start && tanggal <= end;
      });

      const filteredPending = data.pending.filter((item: TotalPerTanggal) => {
        const tanggal = new Date(item.tanggal);
        return tanggal >= start && tanggal <= end;
      });

      const filteredBatal = data.batal.filter((item: TotalPerTanggal) => {
        const tanggal = new Date(item.tanggal);
        return tanggal >= start && tanggal <= end;
      });

      const filteredSelesai = data.selesai.filter((item: TotalPerTanggal) => {
        const tanggal = new Date(item.tanggal);
        return tanggal >= start && tanggal <= end;
      });
      const filteredAssigment = data.assigment.filter((item: AssigmentPerTanggal) => {
        const tanggal = new Date(item.tanggal);
        return tanggal >= start && tanggal <= end;
      })

      const filteredTicket = data.ticket.filter((item: Ticket) => {
        const tanggal = new Date(item.tanggal);
        return tanggal >= start && tanggal <= end;
      });

      setFilteredDataTotal(filteredTotal);
      setFilteredDataMenunggu(filteredMenunggu);
      setFilteredDataProses(filteredProses);
      setFilteredDataPending(filteredPending);
      setFilteredDataBatal(filteredBatal);
      setFilteredDataSelesai(filteredSelesai);
      setFilteredAssigment(filteredAssigment);
      setFilteredTicket(filteredTicket);
    }
    else {
      setFilteredDataTotal(data.totalTiket || []);
      setFilteredDataMenunggu(data.menunggu || []);
      setFilteredDataProses(data.proses || []);
      setFilteredDataPending(data.pending || []);
      setFilteredDataBatal(data.batal || []);
      setFilteredDataSelesai(data.selesai || []);
      setFilteredAssigment(data.assigment || []);
      setFilteredTicket(data.ticket || []);
    }
  }, [startDate, endDate, data]);
  const totalTiket = filteredDataTotal.reduce((total, item) => total + item.total, 0);
  const totalMenunggu = filteredDataMenunggu.reduce((total, item) => total + item.total, 0);
  const totalProses = filteredDataProses.reduce((total, item) => total + item.total, 0);
  const totalPending = filteredDataPending.reduce((total, item) => total + item.total, 0);
  const totalBatal = filteredDataBatal.reduce((total, item) => total + item.total, 0);
  const totalSelesai = filteredDataSelesai.reduce((total, item) => total + item.total, 0);

  const teknisiTotal: { [key: string]: number } = {};

  filteredAssigment.forEach((item) => {
    item.data.forEach((d) => {
      if (teknisiTotal[d.nama_teknisi]) {
        teknisiTotal[d.nama_teknisi] += d.total;
      } else {
        teknisiTotal[d.nama_teknisi] = d.total;
      }
    });
  });

  const teknisiChartData = Object.entries(teknisiTotal).map(([nama_teknisi, total]) => ({
    nama_teknisi,
    total,
  }));
  const summaryCards = [
    { key: 'total', title: "Total Tickets", value: totalTiket || 0, icon: "fas fa-ticket" },
    { key: 'menunggu', title: "Waiting Tickets", value: totalMenunggu || 0, icon: "fas fa-ticket-alt" },
    { key: 'proses', title: "Tickets In Process", value: totalProses || 0, icon: "fas fa-cogs" },
    { key: 'pending', title: "Pending Tickets", value: totalPending || 0, icon: "fas fa-clock" },
    { key: 'selesai', title: "Completed Tickets", value: totalSelesai || 0, icon: "fas fa-check-circle" },
    { key: 'batal', title: "Cancelled Tickets", value: totalBatal || 0, icon: "fas fa-times-circle" },
  ] as const;
  


  useEffect(() => {
    const filtered = filteredTicket.filter(
      (item) =>
        item.tanggal.toLowerCase().includes(filterText.toLowerCase()) ||
        item.nama_satker.toLowerCase().includes(filterText.toLowerCase()) ||
        item.nama_pic_ruangan.toLowerCase().includes(filterText.toLowerCase()) ||
        item.status.toLowerCase().includes(filterText.toLowerCase())
    );
    const filteredSelesai = filteredTicket
      .filter(item => item.status.toLowerCase() === "selesai") // hanya ambil yang statusnya selesai
      .filter(
        (item) =>
          item.tanggal.toLowerCase().includes(filterText.toLowerCase()) ||
          item.nama_satker.toLowerCase().includes(filterText.toLowerCase()) ||
          item.nama_pic_ruangan.toLowerCase().includes(filterText.toLowerCase()) ||
          item.status.toLowerCase().includes(filterText.toLowerCase())
      );
    const filteredMenunggu = filteredTicket
      .filter(item => item.status.toLowerCase() === "menunggu") // hanya ambil yang statusnya selesai
      .filter(
        (item) =>
          item.tanggal.toLowerCase().includes(filterText.toLowerCase()) ||
          item.nama_satker.toLowerCase().includes(filterText.toLowerCase()) ||
          item.nama_pic_ruangan.toLowerCase().includes(filterText.toLowerCase()) ||
          item.status.toLowerCase().includes(filterText.toLowerCase())
      );
    const filteredPending = filteredTicket
      .filter(item => item.status.toLowerCase() === "pending") // hanya ambil yang statusnya selesai
      .filter(
        (item) =>
          item.tanggal.toLowerCase().includes(filterText.toLowerCase()) ||
          item.nama_satker.toLowerCase().includes(filterText.toLowerCase()) ||
          item.nama_pic_ruangan.toLowerCase().includes(filterText.toLowerCase()) ||
          item.status.toLowerCase().includes(filterText.toLowerCase())
      )
    const filteredBatal = filteredTicket
      .filter(item => item.status.toLowerCase() === "dibatalkan") // hanya ambil yang statusnya selesai
      .filter(
        (item) =>
          item.tanggal.toLowerCase().includes(filterText.toLowerCase()) ||
          item.nama_satker.toLowerCase().includes(filterText.toLowerCase()) ||
          item.nama_pic_ruangan.toLowerCase().includes(filterText.toLowerCase()) ||
          item.status.toLowerCase().includes(filterText.toLowerCase())
      )
    const filteredProses = filteredTicket
      .filter(item => item.status.toLowerCase() === "dikerjakan") // hanya ambil yang statusnya selesai
      .filter(
        (item) =>
          item.tanggal.toLowerCase().includes(filterText.toLowerCase()) ||
          item.nama_satker.toLowerCase().includes(filterText.toLowerCase()) ||
          item.nama_pic_ruangan.toLowerCase().includes(filterText.toLowerCase()) ||
          item.status.toLowerCase().includes(filterText.toLowerCase())
      )
    setFilteredItems(filtered);
    setFilteredItemsSelesai(filteredSelesai);
    setFilteredItemsMenunggu(filteredMenunggu);
    setFilteredItemsPending(filteredPending);
    setFilteredItemsBatal(filteredBatal);
    setFilteredItemsProses(filteredProses);
  }, [filterText, filteredTicket,]);


  const translateStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "menunggu":
        return "Waiting";
      case "dikerjakan":
        return "On Process";
      case "pending":
        return "Pending";
      case "selesai":
        return "Completed";
      case "dibatalkan":
        return "Cancelled";
      default:
        return status; // fallback jika tidak cocok
    }
  };

  const Columns = [
    {
      name: "No",
      selector: (_: unknown, index: number) => index + 1,
      sortable: true,
      width: "50px",
      wrap: true,
    },
    {
      name: "Work Unit",
      selector: (row: Ticket) => row.nama_satker,
      sortable: true,
      wrap: true,
    },
    {
      name: "Room PIC",
      selector: (row: Ticket) => row.nama_pic_ruangan,
      sortable: true,
      wrap: true,
    },
    {
      name: "Ticket Date",
      selector: (row: Ticket) =>
        new Date(row.tanggal).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      sortable: true,
      wrap: true,
    },
    {
      name: "Status",
      selector: (row: Ticket) => translateStatus(row.status),
      sortable: true,
      wrap: true,
    }
  ];
  const dataMap = {
    total: filteredItems, // jika ada
    menunggu: filteredItemsMenunggu,
    proses: filteredItemsProses,
    pending: filteredItemsPending,
    selesai: filteredItemsSelesai,
    batal: filteredItemsBatal,
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
            <FaRegCalendarAlt style={{ fontSize: '1.2rem' }} /> {/* Ikon kalender */}
            <span>
              Date:
              {startDate && endDate && (
                <> {new Date(startDate).toLocaleDateString('id-ID')} s.d. {new Date(endDate).toLocaleDateString('id-ID')}</>
              )}
            </span>
          </div>
          {showDateRange && (
            <div className={styles.datePickerWrapper}>
              <DateRangeInput
                onDateChange={handleDateChange}
                onDone={() => setShowDateRange(false)}
              />
            </div>
          )}
        </div>
      </div>

      <div className="row g-4 align-items-start">
        {/* Summary Cards */}
        <div className="col-12 col-md-7">
          <div className="row px-1 gap-4 justify-content-center">
            {summaryCards.map((card, i) => (
              <div
                key={i}
                className={`${styles.mediumCard} col-xl-4 col-md-6 col-12 card`}
                onClick={() => setSelectedTable(card.key)} // ganti status tabel
                style={{ cursor: 'pointer' }}
              >
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

        </div>

        {/* Vendor Statistics */}
        <div className="col-12 col-md-5" style={{ marginTop: '-20px' }}>
          <div className={`${styles.card} w-100`}>
            <div className={`${styles.card__cardHeader} chart d-flex justify-content-between align-items-center`}>
              <h6 className="card-title text-start text-white mb-0">Vendor Work Statistics</h6>
              <div className={`${styles.card__cardHeader__date} d-flex align-items-center gap-2`}></div>
            </div>
            <div className="card-body">
              <DonutChartTeknisi data={teknisiChartData} />
            </div>
          </div>
        </div>
      </div>


      <div className={`${styles.card} mb-3`}>
        <div className={`${styles.card__cardHeader} chart d-flex justify-content-between align-items-center`}>
          <h6 className="card-title text-start text-white mb-0">
            {selectedTable.charAt(0).toUpperCase() + selectedTable.slice(1)} Tickets
          </h6>
        </div>
        <div className="card-body">
          <input
            type="text"
            placeholder="Search by Work Unit, Room PIC, Status"
            className="form-control mb-3"
            value={filterText}
            onChange={handleFilterChange}
          />
          <DataTable
            columns={Columns}
            data={dataMap[selectedTable] || []}
            pagination
          />
        </div>
      </div>

    </section>

  );
};

export default ArcareView;
