import React, { useEffect, useState, } from "react";
import styles from "@/styles/arcare.module.scss";
import DateRangeInput from "@/components/elements/Daterange/Daterange";
import { ArcareType, Ticket, TotalPerTanggal } from "@/types/arcare.type";
import dynamic from 'next/dynamic';
const DataTable = dynamic(() => import('react-data-table-component'), {
  ssr: false,
});

interface Props {
  data: ArcareType;
}

const ArcareView: React.FC<Props> = ({ data }) => {
  const [showDateRange, setShowDateRange] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [filteredDataTotal, setFilteredDataTotal] = useState<TotalPerTanggal[]>(data.totalTiket || []);
  const [filteredDataMenunggu, setFilteredDataMenunggu] = useState<TotalPerTanggal[]>(data.menunggu || []);
  const [filteredDataProses, setFilteredDataProses] = useState<TotalPerTanggal[]>(data.proses || []);
  const [filteredDataPending, setFilteredDataPending] = useState<TotalPerTanggal[]>(data.pending || []);
  const [filteredDataBatal, setFilteredDataBatal] = useState<TotalPerTanggal[]>(data.batal || []);
  const [filteredDataSelesai, setFilteredDataSelesai] = useState<TotalPerTanggal[]>(data.selesai || []);
  const [filterText, setFilterText] = useState('');
  const [filteredItems, setFilteredItems] = useState<Ticket[]>(data.ticket || []);
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

      setFilteredDataTotal(filteredTotal);
      setFilteredDataMenunggu(filteredMenunggu);
      setFilteredDataProses(filteredProses);
      setFilteredDataPending(filteredPending);
      setFilteredDataBatal(filteredBatal);
      setFilteredDataSelesai(filteredSelesai);
    }
    else {
      setFilteredDataTotal(data.totalTiket || []);
      setFilteredDataMenunggu(data.menunggu || []);
      setFilteredDataProses(data.proses || []);
      setFilteredDataPending(data.pending || []);
      setFilteredDataBatal(data.batal || []);
      setFilteredDataSelesai(data.selesai || []);
    }
  }, [startDate, endDate, data]);
  const totalTiket = filteredDataTotal.reduce((total, item) => total + item.total, 0);
  const totalMenunggu = filteredDataMenunggu.reduce((total, item) => total + item.total, 0);
  const totalProses = filteredDataProses.reduce((total, item) => total + item.total, 0);
  const totalPending = filteredDataPending.reduce((total, item) => total + item.total, 0);
  const totalBatal = filteredDataBatal.reduce((total, item) => total + item.total, 0);
  const totalSelesai = filteredDataSelesai.reduce((total, item) => total + item.total, 0);

  const summaryCards = [
    { title: "Total Ticket", value: totalTiket || 0, icon: "fas fa-ticket" },
    { title: "Ticket Menunggu", value: totalMenunggu || 0, icon: "fas fa-ticket-alt" },
    { title: "Ticket On Process", value: totalProses || 0, icon: "fas fa-cogs" },
    { title: "Pending", value: totalPending || 0, icon: "fas fa-clock" },
    { title: "Ticket Selesai", value: totalSelesai || 0, icon: "fas fa-check-circle" },
    { title: "Ticket Dibatalkan", value: totalBatal || 0, icon: "fas fa-times-circle" },
  ];
  useEffect(() => {
    const filtered = data.ticket.filter(
      (item) =>
        item.tanggal.toLowerCase().includes(filterText.toLowerCase()) ||
        item.nama_satker.toLowerCase().includes(filterText.toLowerCase()) ||
        item.nama_pic_ruangan.toLowerCase().includes(filterText.toLowerCase()) ||
        item.status.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [filterText, data.ticket]);
  const Columns = [
    {
      name: "No", // ✅ Ubah dari 'nama' ke 'name'
      selector: (_: unknown, index: number) => index + 1,
      sortable: true,
    },
    {
      name: "Satuan Kerja",
      selector: (row: Ticket) => row.nama_satker,
      sortable: true,
    },
    {
      name: "PIC Ruangan",
      selector: (row: Ticket) => row.nama_pic_ruangan,
      sortable: true,
    },
    {
      name: "Tanggal Tiket",
      selector: (row: Ticket) => new Date(row.tanggal).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      }),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row: Ticket) => row.status,
      sortable: true,
    },
  ];

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
      <div className="d-flex justify-content-center mb-3">
        <div className="w-100" style={{ maxWidth: '50%' }}>
          <div className="row px-1 gap-4 justify-content-center">
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
        </div>
        <div className="w-100" style={{ maxWidth: '50%', marginTop: '-30px' }}>
          <div className=" justify-content-center">
            <div className={`${styles.card} col-xl-12 col-12`}>
              <div className={`${styles.card__cardHeader} chart d-flex justify-content-between align-items-center`}>
                <h6 className="card-title text-start text-white mb-0">Rekap Tiket</h6>
                <div className={`${styles.card__cardHeader__date} d-flex align-items-center gap-2`}>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.card} mb-3`}>
        <div className={`${styles.card__cardHeader} chart d-flex justify-content-between align-items-center`}>
          <h6 className="card-title text-start text-white mb-0">Rekap Perbaikan</h6>
          <div className={`${styles.card__cardHeader__date} d-flex align-items-center gap-2`}>
          </div>
        </div>
        <div className="card-body">
          <input
            type="text"
            placeholder="Cari berdasarkan Satuan Kerja, PIC Ruangan, Status"
            className="form-control mb-3"
            value={filterText}
            onChange={handleFilterChange}
          />
          <DataTable
            columns={Columns}
            data={filteredItems}
            pagination
          />
        </div>
      </div>
    </section>
  );
};

export default ArcareView;
