// ArmaiView.tsx
import styles from "@/styles/Armail.module.scss";
import { useEffect, useState } from "react";
import $ from "jquery";
import { BarChartVertical } from "@/components/elements/Chart/BarchartVertical";
import CustomCalender from "@/components/elements/Calender/Calender";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net";
import { ArmailType } from "@/types/armail.type";
import DateYearInput from "@/components/elements/Daterange/DateYear";

type JenisSurat =
  | "CSR"
  | "KerjaPraktik"
  | "KerjaSama"
  | "Narasumber"
  | "Presentasi"
  | "Meeting"
  | "Undangan"
  | "Knowledge"
  | "Tugas"
  | "Lamaran"
  | "Penelitian";

interface ArmailViewProps {
  data: ArmailType;
}

const ArmaiView: React.FC<ArmailViewProps> = ({ data }) => {
  const tahunOptions = data?.result?.jumlah?.map((j) => j.tahun.toString()) || [];
  const defaultYear = tahunOptions[tahunOptions.length - 1] || "";
  const [selectedYear, setSelectedYear] = useState(defaultYear);

  const jenisList: JenisSurat[] = [
    "CSR", "KerjaPraktik", "KerjaSama", "Narasumber", "Presentasi",
    "Meeting", "Undangan", "Knowledge", "Tugas", "Lamaran", "Penelitian"
  ];

  useEffect(() => {
    if ($.fn.dataTable.isDataTable("#dataTable")) {
      $("#dataTable").DataTable().destroy();
    }

    $("#dataTable").DataTable({
      scrollX: true,
      paging: false,
      ordering: false,
    });
  }, [data, selectedYear]);

  const handleYearChange = (year: number) => {
    setSelectedYear(String(year));
  };

  const bulanList = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  // Ambil data jumlah untuk tahun yang dipilih
  const jumlahPerTahun = data?.result?.jumlah?.find(j => j.tahun.toString() === selectedYear)?.data || [];

  // Buat map dari bulan ke jenis surat
  const jumlahMap: Record<string, Record<JenisSurat, number>> = {};
  jumlahPerTahun.forEach((item) => {
    const { bulan, ...suratData } = item;
    jumlahMap[bulan] = {} as Record<JenisSurat, number>;
    jenisList.forEach(jenis => {
      jumlahMap[bulan][jenis] = typeof suratData[jenis] === "number" ? suratData[jenis]! : 0;
    });
  });
  return (
    <section className={styles.container}>
      <header className={`${styles.header} d-flex justify-content-between`}>
        <h3 className={`${styles.header__h3} flex-grow-1`}>ArMail</h3>
      </header>

      <div className="row px-1 mb-2 gap-5 justify-content-center">
        <div className="d-flex align-items-center justify-content-end gap-1">
          <input
            type="date"
            placeholder="Search"
            className={`${styles.search} form-control mx-2`}
          />
        </div>
      </div>

      <div className="row px-1 gap-3 justify-content-center my-4">
        {jenisList.map((jenis) => {
          const value = data?.result?.[jenis] ?? 0;  // Jika data kosong, fallback ke 0

          return (
            <div key={jenis} className={`${styles.smallCard} col-xl-2 col-12 card`}>
              <div className={styles.smallCard__cardContent}>
                <div className={styles.smallCard__cardContent__number}>
                  {value}
                </div>
                <div className={styles.smallCard__cardContent__icon}>
                  <i className={`uil ${{
                    CSR: "uil-envelope",
                    KerjaPraktik: "uil-file-edit-alt",
                    KerjaSama: "uil-envelope",
                    Narasumber: "uil-user-circle",
                    Presentasi: "uil-presentation",
                    Meeting: "uil-users-alt",
                    Undangan: "uil-envelope-add",
                    Knowledge: "uil-books",
                    Tugas: "uil-clipboard-notes",
                    Lamaran: "uil-envelope-edit",
                    Penelitian: "uil-book-reader"
                  }[jenis]} icon`} />
                </div>
              </div>
              <p className={styles.smallCard__description}>
                Jumlah Surat {jenis}
              </p>
            </div>
          );
        })}

      </div>

      <div className="card mb-3">
        <div className="card-body" style={{ overflowX: "auto" }}>
          <div className="row px-1 mb-2 gap-3 justify-content-start flex-nowrap" style={{ minWidth: "max-content" }}>
            <div className={styles.chartContainer} style={{ width: "100%", height: "auto" }}>
              <BarChartVertical data={data} />
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <div className="row px-1 mb-2 gap-3 justify-content-center">
            <div className={styles.chartContainer} style={{ width: "100%", height: "auto" }}>
              <CustomCalender data={data?.result?.Surat || []} />
            </div>
          </div>
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
        <div className="card-body table-responsive">
          <table id="dataTable" className="display" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Bulan</th>
                {jenisList.map((jenis) => (
                  <th key={jenis}>Surat {jenis}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bulanList.map((bulan) => {
                const item = jumlahMap[bulan] || {};
                return (
                  <tr key={bulan}>
                    <td>{bulan}</td>
                    {jenisList.map((jenis) => (
                      <td key={jenis}>{item[jenis] ?? 0}</td>
                    ))}
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

export default ArmaiView;
