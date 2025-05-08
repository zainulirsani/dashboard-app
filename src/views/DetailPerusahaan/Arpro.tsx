import React, { useEffect, useState, useMemo, useCallback } from "react";
import $ from "jquery";
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net';
import styles from "@/styles/Arpro.module.scss";
import LineChart from "@/components/elements/Chart/LineChart";
import { ArproType, JenisStatus, totalPertanggalType, totalSepakatType, totalPenawaranType, totalInformasiHargaType, TahunJumlahType, presaleDataType } from "@/types/arpro.type";
import DateYearInput from "@/components/elements/Daterange/DateYear";
import DateRangeInput from "@/components/elements/Daterange/Daterange";

interface ArproViewProps {
  data: ArproType;
}

const ArproView: React.FC<ArproViewProps> = ({ data }) => {
  const [selectedChart, setSelectedChart] = useState<'semua' | 'sepakat' | 'penawaran' | 'draft' | 'informasiHarga'>('semua');
  const [selectData, setSelectData] = useState<'total' | 'nominal'>('total');

  const presaleByMonth = useMemo(() => data.result.presaleByMonth || [], [data.result.presaleByMonth]);
  const totalPertanggal = useMemo(() => data.result.total || [], [data.result.total]);
  const totalSepakat = useMemo(() => data.result.totalSepakat || [], [data.result.totalSepakat]);
  const totalPenawaran = useMemo(() => data.result.totalPenawaran || [], [data.result.totalPenawaran]);
  const totalInformasi = useMemo(() => data.result.totalInformasiHarga || [], [data.result.totalInformasiHarga]);
  const totalDraft = useMemo(() => data.result.totalDraft || [], [data.result.totalDraft]);
  

  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const tahunOptions = useMemo(() =>
    presaleByMonth.map((j: TahunJumlahType) => j.tahun),
    [presaleByMonth]
  );

  const [filteredData, setFilteredData] = useState<totalPertanggalType[]>(totalPertanggal || []);
  const [filteredDateSepakat, setFilteredDateSepakat] = useState<totalSepakatType[]>(totalSepakat || []);
  const [filteredDatePenawaran, setFilteredDatePenawaran] = useState<totalPenawaranType[]>(totalPenawaran || []);
  const [filteredDateInformasi, setFilteredDateInformasi] = useState<totalInformasiHargaType[]>(totalInformasi || []);
  const [filteredDateDraft, setFilteredDateDraft] = useState<totalInformasiHargaType[]>(totalDraft || []);

  const defaultYear = tahunOptions[tahunOptions.length - 1] || new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(defaultYear);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  const jumlahPerTahun = useMemo(() =>
    presaleByMonth.find((j) => j.tahun === selectedYear)?.data || [],
    [presaleByMonth, selectedYear]
  );


  const jumlahMap: Record<string, Record<JenisStatus, number>> = useMemo(() => {
    const map: Record<string, Record<JenisStatus, number>> = {};

    jumlahPerTahun.forEach((item: presaleDataType) => {
      map[item.bulan] = {
        Sepakat: item["Sepakat"] || 0,
        Penawaran: item["Penawaran"] || 0,
        'Informasi Harga': item["Informasi Harga"] || 0,
        Draft: item["Draft"] || 0,
        'Tidak Sepakat': item["Tidak Sepakat"] || 0,
      };
    });

    return map;
  }, [jumlahPerTahun]);

  const isValidDate = (date: string) => !isNaN(new Date(date).getTime());

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
      setFilteredDatePenawaran(filterDataPenawaran);
      setFilteredDateInformasi(filterDataInformasi);
      setFilteredDateDraft(filterDataDraft);
    } else {
      setFilteredData(totalPertanggal);
      setFilteredDateSepakat(totalSepakat);
      setFilteredDatePenawaran(totalPenawaran);
      setFilteredDateInformasi(totalInformasi);
      setFilteredDateDraft(totalDraft);
    }
  }, [startDate, endDate, totalPertanggal, totalSepakat, totalPenawaran, totalInformasi, totalDraft]);

  const dataForChart = filteredData.map((item: any) => ({
    tanggal: item.tanggal,
    jumlah: item.jumlah_presale,
    nominal: item.nominal,
  }));

  const dataForChartSepakat = filteredDateSepakat.map((item: any) => ({
    tanggal: item.tanggal,
    jumlah: item.jumlah_presale,
    nominal: item.nominal,
  }));

  const dataForChartPenawaran = filteredDatePenawaran.map((item: any) => ({
    tanggal: item.tanggal,
    jumlah: item.jumlah_presale,
    nominal: item.nominal,
  }));

  const dataForChartInformasi = filteredDateInformasi.map((item: any) => ({
    tanggal: item.tanggal,
    jumlah: item.jumlah_presale,
    nominal: item.nominal,
  }));

  const dataForChartDraft = filteredDateDraft.map((item: any) => ({
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

  const handleYearChange = useCallback((year: number) => {
    setSelectedYear(year);
  }, []);

  const jenisList: JenisStatus[] = useMemo(
    () => ['Sepakat', 'Penawaran', 'Informasi Harga', 'Draft', 'Tidak Sepakat'],
    []
  );
  

  const bulanList: string[] = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

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

  useEffect(() => {
    const tableId = "#dataTable";

    if ($.fn.dataTable.isDataTable(tableId)) {
      $(tableId).DataTable().clear().destroy();
    }

    $(tableId).DataTable({
      scrollX: true,
      paging: false,
      ordering: false,
      searching: false,
      info: false,
    });
  }, [selectedYear, jumlahMap]);


  return (
    <section className="p-3">
      <header className={`${styles.header} d-flex justify-content-between`}>
        <h3 className={styles.header__h3}>ArPro</h3>
      </header>

      <div className="row px-1 gap-4 justify-content-center mb-3">
        <div className={`${styles.mediumCard} col-xl-2 col-6 card`}>
          <div
            className="card-content d-flex flex-column align-items-center justify-content-center"
          >
            <p className={`${styles.mediumCard__description} text-center`}>Total Pre Sale</p>
            <h5 className={`${styles.mediumCard__number}`}>Rp. 3,000,000</h5>
          </div>
        </div>
        <div className={`${styles.mediumCard} col-xl-2 col-6 card`}>
          <div
            className="card-content d-flex flex-column align-items-center justify-content-center"
          >
            <p className={`${styles.mediumCard__description} text-center`}>Pre Sale Sepakat</p>
            <h5 className={`${styles.mediumCard__number}`}>Rp. 000</h5>
          </div>
        </div>
        <div className={`${styles.mediumCard} col-xl-2 col-12 card`}>
          <div
            className="card-content d-flex flex-column align-items-center justify-content-center"
          >
            <p className={`${styles.mediumCard__description} text-center`}>Pre Sale Tidak Sepakat</p>
            <h5 className={`${styles.mediumCard__number}`}>Rp. 3,000,000</h5>
          </div>
        </div>
        <div className={`${styles.mediumCard} col-xl-2 col-12 card`}>
          <div
            className="card-content d-flex flex-column align-items-center justify-content-center"
          >
            <p className={`${styles.mediumCard__description} text-center`}>Pre Sale Penawaran</p>
            <h5 className={`${styles.mediumCard__number}`}>Rp. 3,000,000</h5>
          </div>
        </div>
        <div className={`${styles.mediumCard} col-xl-2 col-12 card`}>
          <div
            className="card-content d-flex flex-column align-items-center justify-content-center"
          >
            <p className={`${styles.mediumCard__description} text-center`}>Pre Sale Penawaran Harga</p>
            <h5 className={`${styles.mediumCard__number}`}>Rp. 3,000,000</h5>
          </div>
        </div>
        <div className={`${styles.mediumCard} col-xl-2 col-12 card`}>
          <div
            className="card-content d-flex flex-column align-items-center justify-content-center"
          >
            <p className={`${styles.mediumCard__description} text-center`}>Pre sale Aprovval</p>
            <h5 className={`${styles.mediumCard__number}`}>Rp. 3,000,000</h5>
          </div>
        </div>
        <div className={`${styles.mediumCard} col-xl-2 col-12 card`}>
          <div
            className="card-content d-flex flex-column align-items-center justify-content-center"
          >
            <p className={`${styles.mediumCard__description} text-center`}>Pre Sale Draft</p>
            <h5 className={`${styles.mediumCard__number}`}>Rp. 000</h5>
          </div>
        </div>
      </div>
      {/* Grafik */}
      <div className="card shadow-sm border-0 mb-3">
        <div className={`${styles.chart} card-header d-flex justify-content-between align-items-center text-white`}>
          <h6 className="mb-0">Grafik Pre Sale</h6>
          <span className="me-1">
            <DateRangeInput onDateChange={handleDateChange} />
          </span>
          <div className="mt-3 d-flex justify-content-end">
            <select
              className="form-select form-select-sm w-auto"
              value={selectedChart}
              onChange={(e) => setSelectedChart(e.target.value as any)}
            >
              <option value="semua">Semua Status</option>
              <option value="sepakat">Sepakat</option>
              <option value="penawaran">Penawaran</option>
              <option value="draft">Draft</option>
              <option value="informasiHarga">Informasi Harga</option>
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
              Nominal
            </button>
          </div>
          {/* Chart */}
          <div className="chart-container" style={{ height: "400px", width: "97%" }}>
            <LineChart
              chartData={getDataForChart()!}
              titleX="Tanggal"
              titleY="Jumlah / Nominal"
              isNominal={true}
            />

          </div>
        </div>
      </div>

      {/* Tabel */}
      <div className="card mb-3">
        <div className={`${styles.card__cardHeader} d-flex justify-content-between align-items-center`}>
          <h6 className="card-title text-start text-white mb-0">Data Pre Sale</h6>
          <div className={`${styles.card__cardHeader__date} d-flex align-items-center gap-2`}>
            <DateYearInput
              options={availableYears}
              value={selectedYear}
              onChange={handleYearChange}
            />
          </div>
        </div>
        <div className="card-body table-responsive">
          <table id="dataTable" className="display" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Bulan</th>
                {jenisList.map((jenis) => (
                  <th key={jenis}>Presale {jenis}</th>
                ))}
                <th>Total</th> {/* Menambahkan total */}
              </tr>
            </thead>
            <tbody>
              {bulanList.map((bulan) => {
                const item = jumlahMap[bulan] || {
                  Sepakat: 0,
                  Penawaran: 0,
                  'Informasi Harga': 0,
                  Draft: 0,
                  'Tidak Sepakat': 0
                };

                const total = Object.values(item).reduce((a, b) => a + b, 0);

                return (
                  <tr key={bulan}>
                    <td>{bulan}</td>
                    {jenisList.map((jenis) => (
                      <td key={jenis}>{item[jenis] ?? 0}</td>
                    ))}
                    <td>{total}</td> {/* Menampilkan total */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ArproView;
