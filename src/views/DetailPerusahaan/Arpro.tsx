import React, { useEffect, useState, useMemo, useCallback } from "react";
import styles from "@/styles/Arpro.module.scss";
import { FaRegCalendarAlt } from 'react-icons/fa';
import LineChart from "@/components/elements/Chart/LineChart";
import { ArproType, JenisStatus, totalPertanggalType, totalSepakatType, tidakSepakatType, totalPenawaranType, totalInformasiHargaType, TahunJumlahType, presaleDataType, totalDraftType } from "@/types/arpro.type";
import DateYearInput from "@/components/elements/Daterange/DateYear";
import DateRangeInput from "@/components/elements/Daterange/Daterange";
type ChartOption = "semua" | "sepakat" | "Tidak Sepakat" | "penawaran" | "draft" | "informasiHarga";
import dynamic from 'next/dynamic';
const DataTable = dynamic(() => import('react-data-table-component'), {
  ssr: false,
});
interface ArproViewProps {
  data: ArproType;
}

const ArproView: React.FC<ArproViewProps> = ({ data }) => {
  const [selectedChart, setSelectedChart] = useState<ChartOption>("semua");
  const [selectData, setSelectData] = useState<'total' | 'nominal'>('total');
  const [showDateRange, setShowDateRange] = useState(false);
  const presaleByMonth = useMemo(() => data.result.presaleByMonth || [], [data.result.presaleByMonth]);
  const totalPertanggal = useMemo(() => data.result.total || [], [data.result.total]);
  const totalSepakat = useMemo(() => data.result.totalSepakat || [], [data.result.totalSepakat]);
  const totalTidakSepakat = useMemo(() => data.result.totalTidakSepakat || [], [data.result.totalTidakSepakat]);
  const totalPenawaran = useMemo(() => data.result.totalPenawaran || [], [data.result.totalPenawaran]);
  const totalInformasi = useMemo(() => data.result.totalInformasiHarga || [], [data.result.totalInformasiHarga]);
  const totalDraft = useMemo(() => data.result.totalDraft || [], [data.result.totalDraft]);
  const bulanList = useMemo(() => ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"], []);
  const toggleDateRange = () => {
    setShowDateRange(!showDateRange);
  };
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const tahunOptions = useMemo(() =>
    presaleByMonth.map((j: TahunJumlahType) => j.tahun),
    [presaleByMonth]
  );

  const [filteredData, setFilteredData] = useState<totalPertanggalType[]>(totalPertanggal || []);
  const [filteredDateSepakat, setFilteredDateSepakat] = useState<totalSepakatType[]>(totalSepakat || []);
  const [filteredDataTidakSepakat, setFilteredDataTidakSepakat] = useState<tidakSepakatType[]>([]);
  const [filteredDatePenawaran, setFilteredDatePenawaran] = useState<totalPenawaranType[]>(totalPenawaran || []);
  const [filteredDateInformasi, setFilteredDateInformasi] = useState<totalInformasiHargaType[]>(totalInformasi || []);
  const [filteredDateDraft, setFilteredDateDraft] = useState<totalInformasiHargaType[]>(totalDraft || []);

  const defaultYear = tahunOptions[tahunOptions.length - 1] || new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(defaultYear);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  const jumlahPerTahun = useMemo(() => {
    const data = presaleByMonth.find((j) => j.tahun === selectedYear)?.data || [];
    return [...data].sort((a, b) => {
      return bulanList.indexOf(a.bulan) - bulanList.indexOf(b.bulan);
    });
  }, [bulanList, presaleByMonth, selectedYear]);



  const columns = [
    {
      name: "Mounth",
      selector: (row: presaleDataType) => row.bulan,
      sortable: true,
    },
    {
      name: "Agreed",
      selector: (row: presaleDataType) => row["Sepakat"],
      sortable: true,
    },
    {
      name: "Offered ",
      selector: (row: presaleDataType) => row["Penawaran"],
      sortable: true,
    },
    {
      name: "Draft",
      selector: (row: presaleDataType) => row["Draft"],
      sortable: true,
    },
    {
      name: "Price Info",
      selector: (row: presaleDataType) => row["Informasi Harga"],
      sortable: true,
    },
    {
      name: "Disagreed Pre Sale",
      selector: (row: presaleDataType) => row["Tidak Sepakat"],
      sortable: true,
    },
  ];


  const isValidDate = (date: string) => !isNaN(new Date(date).getTime());
  useEffect(() => {
    if (data.result.total && data.result.total.length > 0) {
      // Ambil semua tanggal yang valid
      const validDates = data.result.total
        .map(item => new Date(item.tanggal))
        .filter(date => !isNaN(date.getTime()));

      // Ambil tahun terbesar
      const latestYear = Math.max(...validDates.map(date => date.getFullYear()));

      // Filter hanya data dari tahun terakhir
      const datesInLatestYear = validDates.filter(date => date.getFullYear() === latestYear);

      // Ambil bulan terbesar dari tahun tersebut (0 = Jan, 11 = Des)
      const latestMonth = Math.max(...datesInLatestYear.map(date => date.getMonth()));

      // Buat tanggal awal dan akhir bulan tersebut
      const start = new Date(latestYear, latestMonth, 1);
      const end = new Date(latestYear, latestMonth + 1, 0); // hari terakhir bulan itu

      // Format ke yyyy-mm-dd
      const formatDate = (date: Date) =>
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      setStartDate(formatDate(start));
      setEndDate(formatDate(end));
    }
  }, [data.result.total]);

  useEffect(() => {
    if (startDate && endDate) {
      if (!isValidDate(startDate) || !isValidDate(endDate)) {
        console.error("Tanggal yang dimasukkan tidak valid.");
        return;
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      const filterDataTotal = totalPertanggal.filter((item: totalPertanggalType) => {
        const date = new Date(item.tanggal);
        return date >= start && date <= end;
      });

      const filterDataSepakat = totalSepakat.filter((item: totalSepakatType) => {
        const date = new Date(item.tanggal);
        return date >= start && date <= end;
      });

      const filterDataTidakSepakat = totalTidakSepakat.filter((item: tidakSepakatType) => {
        const date = new Date(item.tanggal);
        return date >= start && date <= end;
      })

      const filterDataPenawaran = totalPenawaran.filter((item: totalPenawaranType) => {
        const date = new Date(item.tanggal);
        return date >= start && date <= end;
      });

      const filterDataInformasi = totalInformasi.filter((item: totalInformasiHargaType) => {
        const date = new Date(item.tanggal);
        return date >= start && date <= end;
      });

      const filterDataDraft = totalDraft.filter((item: totalInformasiHargaType) => {
        const date = new Date(item.tanggal);
        return date >= start && date <= end;
      });

      setFilteredData(filterDataTotal);
      setFilteredDateSepakat(filterDataSepakat);
      setFilteredDataTidakSepakat(filterDataTidakSepakat);
      setFilteredDatePenawaran(filterDataPenawaran);
      setFilteredDateInformasi(filterDataInformasi);
      setFilteredDateDraft(filterDataDraft);
    } else {
      setFilteredData(totalPertanggal);
      setFilteredDateSepakat(totalSepakat);
      setFilteredDataTidakSepakat(totalTidakSepakat);
      setFilteredDatePenawaran(totalPenawaran);
      setFilteredDateInformasi(totalInformasi);
      setFilteredDateDraft(totalDraft);
    }
  }, [startDate, endDate, totalPertanggal, totalSepakat, totalTidakSepakat, totalPenawaran, totalInformasi, totalDraft]);

  const dataForChart = filteredData.map((item: totalPertanggalType) => ({
    tanggal: item.tanggal,
    jumlah: item.jumlah_presale,
    nominal: item.nominal,
  }));

  const dataForChartSepakat = filteredDateSepakat.map((item: totalSepakatType) => ({
    tanggal: item.tanggal,
    jumlah: item.jumlah_presale,
    nominal: item.nominal,
  }));

  const dataForChartTidakSepakat = filteredDataTidakSepakat.map((item: tidakSepakatType) => ({
    tanggal: item.tanggal,
    jumlah: item.jumlah_presale,
    nominal: item.nominal,
  }));

  const dataForChartPenawaran = filteredDatePenawaran.map((item: totalPenawaranType) => ({
    tanggal: item.tanggal,
    jumlah: item.jumlah_presale,
    nominal: item.nominal,
  }));

  const dataForChartInformasi = filteredDateInformasi.map((item: totalInformasiHargaType) => ({
    tanggal: item.tanggal,
    jumlah: item.jumlah_presale,
    nominal: item.nominal,
  }));

  const dataForChartDraft = filteredDateDraft.map((item: totalDraftType) => ({
    tanggal: item.tanggal,
    jumlah: item.jumlah_presale,
    nominal: item.nominal,
  }));

  const getDataForChart = () => {
    if (selectedChart === 'semua' && selectData === 'total') {
      return {
        labels: dataForChart.map(item => item.tanggal),
        datasets: [
          {
            label: "Total Harga",
            data: dataForChart.map(item => item.jumlah),
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
          },
        ],
      };
    }
    else if (selectedChart === 'semua' && selectData === 'nominal') {
      return {
        labels: dataForChart.map(item => item.tanggal),
        datasets: [
          {
            label: "Total Nego",
            data: dataForChart.map(item => item.nominal),
            borderColor: "rgb(83, 112, 207)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
          },
        ],
      };
    }
    else if (selectedChart === 'sepakat' && selectData === 'total') {
      return {
        labels: dataForChartSepakat.map(item => item.tanggal),
        datasets: [
          {
            label: "Total Nego",
            data: dataForChartSepakat.map(item => item.jumlah),
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
          },
        ],
      };
    }
    else if (selectedChart === 'sepakat' && selectData === 'nominal') {
      return {
        labels: dataForChartSepakat.map(item => item.tanggal),
        datasets: [
          {
            label: "Total Nego",
            data: dataForChartSepakat.map(item => item.nominal),
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
          },
        ],
      };
    }
    else if (selectedChart === 'Tidak Sepakat' && selectData === 'total') {
      return {
        labels: dataForChartTidakSepakat.map(item => item.tanggal),
        datasets: [
          {
            label: "Total Nego",
            data: dataForChartTidakSepakat.map(item => item.jumlah),
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
          },
        ],
      };
    }
    else if (selectedChart === 'Tidak Sepakat' && selectData === 'nominal') {
      return {
        labels: dataForChartTidakSepakat.map(item => item.tanggal),
        datasets: [
          {
            label: "Total Nego",
            data: dataForChartTidakSepakat.map(item => item.nominal),
            borderColor: "rgb(83, 112, 207)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
          },
        ],
      };
    }
    else if (selectedChart === 'penawaran' && selectData === 'total') {
      return {
        labels: dataForChartPenawaran.map(item => item.tanggal),
        datasets: [
          {
            label: "Total Nego",
            data: dataForChartPenawaran.map(item => item.jumlah),
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
          },
        ],
      };
    }
    else if (selectedChart === 'penawaran' && selectData === 'nominal') {
      return {
        labels: dataForChartPenawaran.map(item => item.tanggal),
        datasets: [
          {
            label: "Total Nego",
            data: dataForChartPenawaran.map(item => item.nominal),
            borderColor: "rgb(83, 112, 207)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
          },
        ],
      };
    }
    else if (selectedChart === 'draft' && selectData === 'total') {
      return {
        labels: dataForChartDraft.map(item => item.tanggal),
        datasets: [
          {
            label: "Total Nego",
            data: dataForChartDraft.map(item => item.jumlah),
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
          },
        ],
      };
    }
    else if (selectedChart === 'draft' && selectData === 'nominal') {
      return {
        labels: dataForChartDraft.map(item => item.tanggal),
        datasets: [
          {
            label: "Total Nego",
            data: dataForChartDraft.map(item => item.nominal),
            borderColor: "rgb(83, 112, 207)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
          },
        ],
      };
    }
    else if (selectedChart === 'informasiHarga' && selectData === 'total') {
      return {
        labels: dataForChartInformasi.map(item => item.tanggal),
        datasets: [
          {
            label: "Total Nego",
            data: dataForChartInformasi.map(item => item.jumlah),
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
          },
        ],
      };
    }
    else if (selectedChart === 'informasiHarga' && selectData === 'nominal') {
      return {
        labels: dataForChartInformasi.map(item => item.tanggal),
        datasets: [
          {
            label: "Total Nego",
            data: dataForChartInformasi.map(item => item.nominal),
            borderColor: "rgb(83, 112, 207)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
          },
        ],
      };
    }
  };

  const totalPresale = dataForChart.reduce((total, item) => total + item.jumlah, 0);
  const nominalPresale = dataForChart.reduce((total, item) => total + item.nominal, 0);
  const nominalPresaleFormatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(nominalPresale);
  const SepakatCount = dataForChartSepakat.reduce((total, item) => total + item.jumlah, 0);
  const nominalSepakat = dataForChartSepakat.reduce((total, item) => total + item.nominal, 0);
  const nominalSepakatFormatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(nominalSepakat);
  const TidakSepakatCount = dataForChartTidakSepakat.reduce((total, item) => total + item.jumlah, 0);
  const nominalTidakSepakat = dataForChartTidakSepakat.reduce((total, item) => total + item.nominal, 0);
  const nominalTidakSepakatFormatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(nominalTidakSepakat);
  const PenawaranCount = dataForChartPenawaran.reduce((total, item) => total + item.jumlah, 0);
  const nominalPenawaran = dataForChartPenawaran.reduce((total, item) => total + item.nominal, 0);
  const nominalPenawaranFormatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(nominalPenawaran);
  const DraftCount = dataForChartDraft.reduce((total, item) => total + item.jumlah, 0);
  const nominalDraft = dataForChartDraft.reduce((total, item) => total + item.nominal, 0);
  const nominalDraftFormated = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(nominalDraft);

  const handleYearChange = useCallback((year: number) => {
    setSelectedYear(year);
  }, []);

  const jenisList: JenisStatus[] = useMemo(
    () => ['Sepakat', 'Penawaran', 'Informasi Harga', 'Draft', 'Tidak Sepakat'],
    []
  );

  const handleDateChange = ({ startDate, endDate }: { startDate: string; endDate: string }) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  useEffect(() => {
    const yearsWithData = presaleByMonth
      .filter((item: TahunJumlahType) =>
        item.data.some((entry: presaleDataType) =>
          jenisList.some((jenis) => (entry[jenis] || 0) > 0)
        )
      )
      .map((item) => item.tahun);

    setAvailableYears(yearsWithData);

    if (!yearsWithData.includes(selectedYear) && yearsWithData.length > 0) {
      setSelectedYear(Math.max(...yearsWithData));
    }
  }, [presaleByMonth, selectedYear, jenisList]);

  return (
    <section className="p-3">
      <header className={`${styles.header} d-flex justify-content-between`}>
        <h3 className={styles.header__h3}>ArPro</h3>
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
      <div className="row px-1 gap-4 justify-content-center mb-3">
        <div className={`${styles.mediumCard} col-xl-2 col-6 card`}>
          <div className="card-content d-flex flex-column align-items-center justify-content-center">
            <p className={`${styles.mediumCard__description} text-center mb-1`}>Total Pre Sale</p>
            <h2 className={`${styles.mediumCard__number} mb-1 mt-1`}>{totalPresale}</h2>
            <h5 className={`${styles.mediumCard__nominal} mb-1 mt-1 text-light`}>{nominalPresaleFormatted}</h5>
          </div>
        </div>

        <div className={`${styles.mediumCard} col-xl-2 col-6 card`}>
          <div className="card-content d-flex flex-column align-items-center justify-content-center">
            <p className={`${styles.mediumCard__description} text-center mb-1`}>Agreed Pre Sale</p>
            <h2 className={`${styles.mediumCard__number} mb-1 mt-1`}>{SepakatCount}</h2>
            <h5 className={`${styles.mediumCard__nominal} mb-1 mt-1 text-light`}>{nominalSepakatFormatted}</h5>
          </div>
        </div>

        <div className={`${styles.mediumCard} col-xl-2 col-12 card`}>
          <div className="card-content d-flex flex-column align-items-center justify-content-center">
            <p className={`${styles.mediumCard__description} text-center mb-1`}>Disagreed Pre Sale</p>
            <h2 className={`${styles.mediumCard__number} mb-1 mt-1`}>{TidakSepakatCount}</h2>
            <h5 className={`${styles.mediumCard__nominal} mb-1 mt-1 text-light`}>{nominalTidakSepakatFormatted}</h5>
          </div>
        </div>

        <div className={`${styles.mediumCard} col-xl-2 col-12 card`}>
          <div className="card-content d-flex flex-column align-items-center justify-content-center">
            <p className={`${styles.mediumCard__description} text-center mb-1`}>Offered Pre Sale</p>
            <h2 className={`${styles.mediumCard__number} mb-1 mt-1`}>{PenawaranCount}</h2>
            <h5 className={`${styles.mediumCard__nominal} mb-1 mt-1 text-light`}>{nominalPenawaranFormatted}</h5>
          </div>
        </div>

        <div className={`${styles.mediumCard} col-xl-2 col-12 card`}>
          <div className="card-content d-flex flex-column align-items-center justify-content-center">
            <p className={`${styles.mediumCard__description} text-center mb-1`}>Draft Pre Sale</p>
            <h2 className={`${styles.mediumCard__number} mb-1 mt-1`}>{DraftCount}</h2>
            <h5 className={`${styles.mediumCard__nominal} mb-1 mt-1 text-light`}>{nominalDraftFormated}</h5>
          </div>
        </div>

      </div>
      {/* Grafik */}
      <div className="card shadow-sm border-0 mb-3">
        <div className={`${styles.chart} card-header d-flex justify-content-between align-items-center text-white`}>
          <h6 className="mb-0">Pre Sale Chart</h6>

          <div className="d-flex align-items-center">
            <select
              className="form-select form-select-sm w-auto"
              value={selectedChart}
              onChange={(e) => setSelectedChart(e.target.value as ChartOption)}
            >
              <option value="semua">All Statuses</option>
              <option value="sepakat">Agreed</option>
              <option value="penawaran">Offered</option>
              <option value="draft">Draft</option>
              <option value="informasiHarga">Price Info</option>
            </select>
          </div>
        </div>

        <div className="card-body collapse show" id="grafikPresaleCollapse">
          <div className="mt-3 d-flex gap-2 justify-content-end">
            <button
              className={`btn btn-sm ${selectData === 'total' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setSelectData('total')}
            >
              Total
            </button>
            <button
              className={`btn btn-sm ${selectData === 'nominal' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setSelectData('nominal')}
            >
              Amount
            </button>
          </div>

          {/* Chart */}
          <div className="chart-container" style={{ height: "400px", width: "97%" }}>
            <LineChart
              chartData={getDataForChart()!}
              titleX="Date"
              titleY="Quantity / Amount"
              isNominal={true}
            />
          </div>
        </div>
      </div>


      {/* Tabel */}
      <div className="card mb-3">
        <div className={`${styles.card__cardHeader} d-flex justify-content-between align-items-center`}>
          <h6 className="card-title text-start text-white mb-0">Pre Sale Data</h6>
          <div className={`${styles.card__cardHeader__date} d-flex align-items-center gap-2`}>
            <DateYearInput
              options={availableYears}
              value={selectedYear}
              onChange={handleYearChange}
            />
          </div>
        </div>

        <div className="card-body">
          <DataTable
            columns={columns}
            data={jumlahPerTahun} // ✅ hanya data sesuai selectedYear
            highlightOnHover
            striped
            responsive
          />
        </div>
      </div>
    </section>
  );
};

export default ArproView;
