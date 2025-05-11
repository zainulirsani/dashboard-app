// ArmaiView.tsx
import styles from "@/styles/Armail.module.scss";
import { useEffect, useState } from "react";
import { ArmailType, CSRType, KerjaSamaType, KerjaPraktikType, NarasumberType, PresentasiType, BulanDataType } from "@/types/armail.type";
import DateRangeInput from "@/components/elements/Daterange/Daterange";
import { CalendarAgenda } from "@/components/elements/Calender/CalenderRsuitejs";
import DateYearInput from "@/components/elements/Daterange/DateYear";
import dynamic from 'next/dynamic';
const DataTable = dynamic(() => import('react-data-table-component'), {
  ssr: false,
});


interface ArmailViewProps {
  data: ArmailType;
}

const ArmaiView: React.FC<ArmailViewProps> = ({ data }) => {
  const tahunOptions = data?.result?.jumlah?.map((j) => j.tahun.toString()) || [];
  const defaultYear = tahunOptions[tahunOptions.length - 1] || "";
  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [showDateRange, setShowDateRange] = useState(false);
  const toggleDateRange = () => {
    setShowDateRange(!showDateRange);
  };
  const handleDateChange = ({ startDate, endDate }: { startDate: string; endDate: string }) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };
  const handleYearChange = (year: number) => {
    setSelectedYear(String(year));
  };
  const ALL_MONTHS = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const normalizeMonthlyData = (rawData: BulanDataType[]): BulanDataType[] => {
    return ALL_MONTHS.map((bulan) => {
      const found = rawData.find((item) => item.bulan === bulan);
      return {
        bulan,
        Undangan: 0,
        CSR: 0,
        Meeting: 0,
        Narasumber: 0,
        Presentasi: 0,
        KerjaPraktik: 0,
        KerjaSama: 0,
        Knowledge: 0,
        Tugas: 0,
        Lamaran: 0,
        Penelitian: 0,
        ...found
      };
    });
  };
  
  const rawData =
    data?.result?.jumlah?.find((j) => j.tahun.toString() === selectedYear)?.data || [];
  const jumlahPerTahun = normalizeMonthlyData(rawData);
  const [filteredDataCSR, setFilteredDataCSR] = useState<CSRType[]>(data.result.CSR || []);
  const [filteredDataKerjaSama, setFilteredDataKerjaSama] = useState<KerjaSamaType[]>(data.result.KerjaSama || []);
  const [filteredDataKerjaPraktik, setFilteredDataKerjaPraktik] = useState<KerjaPraktikType[]>(data.result.KerjaPraktik || []);
  const [filteredDataNarasumber, setFilteredDataNarasumber] = useState<NarasumberType[]>(data.result.Narasumber || []);
  const [filteredDataPresentasi, setFilteredDataPresentasi] = useState<PresentasiType[]>(data.result.Presentasi || []);
  const [filteredDataMeeting, setFilteredDataMeeting] = useState<PresentasiType[]>(data.result.Meeting || []);
  const [filteredDataUndangan, setFilteredDataUndangan] = useState<PresentasiType[]>(data.result.Undangan || []);
  const [filteredDataKnowledge, setFilteredDataKnowledge] = useState<PresentasiType[]>(data.result.Knowledge || []);
  const [filteredDataTugas, setFilteredDataTugas] = useState<PresentasiType[]>(data.result.Tugas || []);
  const [filteredDataLamaran, setFilteredDataLamaran] = useState<PresentasiType[]>(data.result.Lamaran || []);
  const [filteredDataPenelitian, setFilteredDataPenelitian] = useState<PresentasiType[]>(data.result.Penelitian || []);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      const filteredCSR = data.result.CSR.filter((item: CSRType) => {
        const csrDate = new Date(item.tanggal);
        return csrDate >= start && csrDate <= end;
      });
      const filteredKerjaSama = data.result.KerjaSama.filter((item: KerjaSamaType) => {
        const kerjaSamaDate = new Date(item.tanggal);
        return kerjaSamaDate >= start && kerjaSamaDate <= end;
      });
      const filteredKerjaPraktik = data.result.KerjaPraktik.filter((item: KerjaPraktikType) => {
        const kerjaPraktikDate = new Date(item.tanggal);
        return kerjaPraktikDate >= start && kerjaPraktikDate <= end;
      });
      const filteredNarasumber = data.result.Narasumber.filter((item: NarasumberType) => {
        const narasumberDate = new Date(item.tanggal);
        return narasumberDate >= start && narasumberDate <= end;
      });
      const filteredPresentasi = data.result.Presentasi.filter((item: PresentasiType) => {
        const presentasiDate = new Date(item.tanggal);
        return presentasiDate >= start && presentasiDate <= end;
      });
      const filteredMeeting = data.result.Meeting.filter((item: PresentasiType) => {
        const meetingDate = new Date(item.tanggal);
        return meetingDate >= start && meetingDate <= end;
      });
      const filteredUndangan = data.result.Undangan.filter((item: PresentasiType) => {
        const undanganDate = new Date(item.tanggal);
        return undanganDate >= start && undanganDate <= end;
      });
      const filteredKnowledge = data.result.Knowledge.filter((item: PresentasiType) => {
        const knowledgeDate = new Date(item.tanggal);
        return knowledgeDate >= start && knowledgeDate <= end;
      });
      const filteredTugas = data.result.Tugas.filter((item: PresentasiType) => {
        const tugasDate = new Date(item.tanggal);
        return tugasDate >= start && tugasDate <= end;
      });
      const filteredLamaran = data.result.Lamaran.filter((item: PresentasiType) => {
        const lamaranDate = new Date(item.tanggal);
        return lamaranDate >= start && lamaranDate <= end;
      });
      const filteredPenelitian = data.result.Penelitian.filter((item: PresentasiType) => {
        const penelitianDate = new Date(item.tanggal);
        return penelitianDate >= start && penelitianDate <= end;
      });

      setFilteredDataCSR(filteredCSR);
      setFilteredDataKerjaSama(filteredKerjaSama);
      setFilteredDataKerjaPraktik(filteredKerjaPraktik);
      setFilteredDataNarasumber(filteredNarasumber);
      setFilteredDataPresentasi(filteredPresentasi);
      setFilteredDataMeeting(filteredMeeting);
      setFilteredDataUndangan(filteredUndangan);
      setFilteredDataKnowledge(filteredKnowledge);
      setFilteredDataTugas(filteredTugas);
      setFilteredDataLamaran(filteredLamaran);
      setFilteredDataPenelitian(filteredPenelitian);
    } else {
      setFilteredDataCSR(data.result.CSR);
      setFilteredDataKerjaSama(data.result.KerjaSama);
      setFilteredDataKerjaPraktik(data.result.KerjaPraktik);
      setFilteredDataNarasumber(data.result.Narasumber);
      setFilteredDataPresentasi(data.result.Presentasi);
      setFilteredDataMeeting(data.result.Meeting);
      setFilteredDataUndangan(data.result.Undangan);
      setFilteredDataKnowledge(data.result.Knowledge);
      setFilteredDataTugas(data.result.Tugas);
      setFilteredDataLamaran(data.result.Lamaran);
      setFilteredDataPenelitian(data.result.Penelitian);
    }
  }, [startDate, endDate, data]);

  const dataCSR = filteredDataCSR.map((item: CSRType) => ({
    tanggal: item.tanggal,
    total: Number(item.total),
  }));
  const dataKerjaSama = filteredDataKerjaSama.map((item: KerjaSamaType) => ({
    tanggal: item.tanggal,
    total: Number(item.total),
  }));
  const dataKerjaPraktik = filteredDataKerjaPraktik.map((item: KerjaPraktikType) => ({
    tanggal: item.tanggal,
    total: Number(item.total),
  }));
  const dataNarasumber = filteredDataNarasumber.map((item: NarasumberType) => ({
    tanggal: item.tanggal,
    total: Number(item.total),
  }));
  const dataPresentasi = filteredDataPresentasi.map((item: PresentasiType) => ({
    tanggal: item.tanggal,
    total: Number(item.total),
  }));
  const dataMeeting = filteredDataMeeting.map((item: PresentasiType) => ({
    tanggal: item.tanggal,
    total: Number(item.total),
  }));
  const dataUndangan = filteredDataUndangan.map((item: PresentasiType) => ({
    tanggal: item.tanggal,
    total: Number(item.total),
  }));
  const dataKnowledge = filteredDataKnowledge.map((item: PresentasiType) => ({
    tanggal: item.tanggal,
    total: Number(item.total),
  }));
  const dataTugas = filteredDataTugas.map((item: PresentasiType) => ({
    tanggal: item.tanggal,
    total: Number(item.total),
  }));
  const dataLamaran = filteredDataLamaran.map((item: PresentasiType) => ({
    tanggal: item.tanggal,
    total: Number(item.total),
  }));
  const dataPenelitian = filteredDataPenelitian.map((item: PresentasiType) => ({
    tanggal: item.tanggal,
    total: Number(item.total),
  }));

  const totalCSR = dataCSR.reduce((sum, item) => sum + (item.total || 0), 0);
  const totalKerjaSama = dataKerjaSama.reduce((sum, item) => sum + (item.total || 0), 0);
  const totalKerjaPraktik = dataKerjaPraktik.reduce((sum, item) => sum + (item.total || 0), 0);
  const totalNarasumber = dataNarasumber.reduce((sum, item) => sum + (item.total || 0), 0);
  const totalPresentasi = dataPresentasi.reduce((sum, item) => sum + (item.total || 0), 0);
  const totalMeeting = dataMeeting.reduce((sum, item) => sum + (item.total || 0), 0);
  const totalUndangan = dataUndangan.reduce((sum, item) => sum + (item.total || 0), 0);
  const totalKnowledge = dataKnowledge.reduce((sum, item) => sum + (item.total || 0), 0);
  const totalTugas = dataTugas.reduce((sum, item) => sum + (item.total || 0), 0);
  const totalLamaran = dataLamaran.reduce((sum, item) => sum + (item.total || 0), 0);
  const totalPenelitian = dataPenelitian.reduce((sum, item) => sum + (item.total || 0), 0);


  const columns = [
    {
      name: "Bulan",
      selector: (row: BulanDataType) => row.bulan,
      sortable: true,
    },
    {
      name: "Undangan",
      selector: (row: BulanDataType) => row.Undangan,
      sortable: true,
      right: true,
    },
    {
      name: "CSR",
      selector: (row: BulanDataType) => row.CSR,
      sortable: true,
      right: true,
    },
    {
      name: "Meeting",
      selector: (row: BulanDataType) => row.Meeting,
      sortable: true,
      right: true,
    },
    {
      name: "Narasumber",
      selector: (row: BulanDataType) => row.Narasumber,
      sortable: true,
      right: true,
    },
    {
      name: "Presentasi",
      selector: (row: BulanDataType) => row.Presentasi,
      sortable: true,
      right: true,
    },
    {
      name: "Kerja Praktik",
      selector: (row: BulanDataType) => row.KerjaPraktik,
      sortable: true,
      right: true,
    },
    {
      name: "Kerja Sama",
      selector: (row: BulanDataType) => row.KerjaSama,
      sortable: true,
      right: true,
    },
    {
      name: "Penelitian",
      selector: (row: BulanDataType) => row.Penelitian,
      sortable: true,
      right: true,
    },
    {
      name: "Tugas",
      selector: (row: BulanDataType) => row.Tugas,
      sortable: true,
      right: true,
    },
    {
      name: "Lamaran",
      selector: (row: BulanDataType) => row.Lamaran,
      sortable: true,
    }
  ];

  return (
    <section className="p-3">
      <header className={`${styles.header} d-flex justify-content-between`}>
        <h3 className={`${styles.header__h3} flex-grow-1`}>ArMail</h3>
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
      <div className="row px-1 gap-3 justify-content-center mb-3">
        <div className={`${styles.smallCard} col-xl-2 col-12 card`}>
          <div
            className={`${styles.smallCard__cardContent} d-flex align-items-center justify-content-center`}
          >
            <div className="left-section text-center">
              <h2 className={`${styles.smallCard__cardContent__number} text-center`}>{totalCSR}</h2>
            </div>
            <div className="right-section text-center">
              <i className={`${styles.smallCard__cardContent__icon} uil uil-envelope`}></i>
            </div>
          </div>
          <p className="description text-center">Jumlah Surat CSR</p>
        </div>
        <div className={`${styles.smallCard} col-xl-2 col-12 card`}>
          <div
            className={`${styles.smallCard__cardContent} d-flex align-items-center justify-content-center`}
          >
            <div className="left-section text-center">
              <h2 className={`${styles.smallCard__cardContent__number} text-center`}>{totalKerjaPraktik}</h2>
            </div>
            <div className="right-section text-center">
              <i className={`${styles.smallCard__cardContent__icon} uil-file-edit-alt`}></i>
            </div>
          </div>
          <p className="description text-center">Jumlah Surat Kerja Praktek</p>
        </div>
        <div className={`${styles.smallCard} col-xl-2 col-12 card`}>
          <div
            className={`${styles.smallCard__cardContent} d-flex align-items-center justify-content-center`}
          >
            <div className="left-section text-center">
              <h2 className={`${styles.smallCard__cardContent__number} text-center`}>{totalKerjaSama}</h2>
            </div>
            <div className="right-section text-center">
              <i className={`${styles.smallCard__cardContent__icon} uil uil-envelope`}></i>
            </div>
          </div>
          <p className="description text-center">Jumlah Surat KerjaSama</p>
        </div>
        <div className={`${styles.smallCard} col-xl-2 col-12 card`}>
          <div
            className={`${styles.smallCard__cardContent} d-flex align-items-center justify-content-center`}
          >
            <div className="left-section text-center">
              <h2 className={`${styles.smallCard__cardContent__number} text-center`}>{totalNarasumber}</h2>
            </div>
            <div className="right-section text-center">
              <i className={`${styles.smallCard__cardContent__icon} uil uil-user-circle`}></i>
            </div>
          </div>
          <p className="description text-center">Jumlah Surat Narasumber</p>
        </div>
        <div className={`${styles.smallCard} col-xl-2 col-12 card`}>
          <div
            className={`${styles.smallCard__cardContent} d-flex align-items-center justify-content-center`}
          >
            <div className="left-section text-center">
              <h2 className={`${styles.smallCard__cardContent__number} text-center`}>{totalPresentasi}</h2>
            </div>
            <div className="right-section text-center">
              <i className={`${styles.smallCard__cardContent__icon} uil uil-presentation`}></i>
            </div>
          </div>
          <p className="description text-center">Jumlah Surat Presentasi</p>
        </div>
        <div className={`${styles.smallCard} col-xl-2 col-12 card`}>
          <div
            className={`${styles.smallCard__cardContent} d-flex align-items-center justify-content-center`}
          >
            <div className="left-section text-center">
              <h2 className={`${styles.smallCard__cardContent__number} text-center`}>{totalMeeting}</h2>
            </div>
            <div className="right-section text-center">
              <i className={`${styles.smallCard__cardContent__icon} uil uil-users-alt`}></i>
            </div>
          </div>
          <p className="description text-center">Jumlah Surat Meeting</p>
        </div>
        <div className={`${styles.smallCard} col-xl-2 col-12 card`}>
          <div
            className={`${styles.smallCard__cardContent} d-flex align-items-center justify-content-center`}
          >
            <div className="left-section text-center">
              <h2 className={`${styles.smallCard__cardContent__number} text-center`}>{totalUndangan}</h2>
            </div>
            <div className="right-section text-center">
              <i className={`${styles.smallCard__cardContent__icon} uil uil-envelope-add`}></i>
            </div>
          </div>
          <p className="description text-center">Jumlah Surat Undangan</p>
        </div>
        <div className={`${styles.smallCard} col-xl-2 col-12 card`}>
          <div
            className={`${styles.smallCard__cardContent} d-flex align-items-center justify-content-center`}
          >
            <div className="left-section text-center">
              <h2 className={`${styles.smallCard__cardContent__number} text-center`}>{totalKnowledge}</h2>
            </div>
            <div className="right-section text-center">
              <i className={`${styles.smallCard__cardContent__icon} uil uil-books icon`}></i>
            </div>
          </div>
          <p className="description text-center">Jumlah Surat Knowledge</p>
        </div>
        <div className={`${styles.smallCard} col-xl-2 col-12 card`}>
          <div
            className={`${styles.smallCard__cardContent} d-flex align-items-center justify-content-center`}
          >
            <div className="left-section text-center">
              <h2 className={`${styles.smallCard__cardContent__number} text-center`}>{totalTugas}</h2>
            </div>
            <div className="right-section text-center">
              <i className={`${styles.smallCard__cardContent__icon} uil uil-clipboard-notes`}></i>
            </div>
          </div>
          <p className="description text-center">Jumlah Surat Tugas</p>
        </div>

        <div className={`${styles.smallCard} col-xl-2 col-12 card`}>
          <div
            className={`${styles.smallCard__cardContent} d-flex align-items-center justify-content-center`}
          >
            <div className="left-section text-center">
              <h2 className={`${styles.smallCard__cardContent__number} text-center`}>{totalLamaran}</h2>
            </div>
            <div className="right-section text-center">
              <i className={`${styles.smallCard__cardContent__icon} uil uil-envelope-edit`}></i>
            </div>
          </div>
          <p className="description text-center">Jumlah Surat Lamaran</p>
        </div>

        <div className={`${styles.smallCard} col-xl-2 col-12 card`}>
          <div
            className={`${styles.smallCard__cardContent} d-flex align-items-center justify-content-center`}
          >
            <div className="left-section text-center">
              <h2 className={`${styles.smallCard__cardContent__number} text-center`}>{totalPenelitian}</h2>
            </div>
            <div className="right-section text-center">
              <i className={`${styles.smallCard__cardContent__icon} uil uil-book-reader`}></i>
            </div>
          </div>
          <p className="description text-center">Jumlah Penelitian</p>
        </div>
      </div>
      <div className="card mb-3">

        <div className="row px-1 mb-2 gap-3 justify-content-center">
          <CalendarAgenda suratData={data?.result?.Surat || []} />
        </div>
      </div>
      <div className="card mb-3">
        <div className={`${styles.card__cardHeader} d-flex justify-content-between align-items-center`}>
          <h6 className="card-title text-start text-white mb-0">Rekap Perbaikan</h6>
          <div className={`${styles.card__cardHeader__date} d-flex align-items-center gap-2`}>
            <DateYearInput
              options={tahunOptions.map(Number)}
              value={parseInt(selectedYear)}
              onChange={handleYearChange}
            />
          </div>
        </div>
        <div className="card-body">
          <div style={{ overflowX: 'auto' }}>
            <DataTable
              columns={columns}
              data={jumlahPerTahun}
              highlightOnHover
              striped
              responsive={false} // nonaktifkan 'responsive' bawaan agar tidak memaksa stacking
              noHeader
            />
          </div>

        </div>
      </div>
    </section >
  );
};

export default ArmaiView;
