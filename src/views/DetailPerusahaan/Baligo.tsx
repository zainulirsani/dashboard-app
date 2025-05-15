import styles from "@/styles/baligo.module.scss";
import { baligoType, detail, KurirType, PengirimanItem, PengirimanSelesai, revenue, UserType } from "@/types/baligo.type";
import DateRangeInput from '@/components/elements/Daterange/Daterange';
import { useEffect, useState } from 'react';
import { DonutChartCenterText } from "@/components/elements/Chart/donuteChart";
import LineChart from "@/components/elements/Chart/LineChart";
import dynamic from 'next/dynamic';
const DataTable = dynamic(() => import('react-data-table-component'), {
    ssr: false,
});
interface GroupedKotaItem {
    kota: string;
    total_tarif: number;
    jumlah_pengiriman: number;
    barang: {
        id: number;
        detail_barang: string;
        total_tarif: number;
        created_at: string;
        nama_pengirim: string;
        nama_penerima: string;
    }[];
}

type KotaItem = {
    kota: string;
    jumlah: number;
    persentase: number;
    total_tarif: number;
    totalJumlah: number;
    barang: {
        id: number;
        detail_barang: string;
        total_tarif: number;
        created_at: string;
        nama_pengirim: string;
        nama_penerima: string;
    }[];
};
const BaligoView = ({ data }: { data: baligoType }) => {
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const isValidDate = (date: string) => !isNaN(new Date(date).getTime());
    const [showDateRange, setShowDateRange] = useState(false);
    const [showDetailUser, setShowDetailUser] = useState(false);
    const [showDetailKurir, setShowDetailKurir] = useState(false);
    const [filteredDataUser, setFilteredDataUser] = useState<UserType[]>(data.user || []);
    const [filteredDataPengiriman, setFilteredDataPengiriman] = useState<PengirimanItem[]>(data.pengiriman_count || []);
    const [filteredDataPengirimanSelesai, setFilteredDataPengirimanSelesai] = useState<PengirimanSelesai[]>(data.pengiriman_selesai_count || []);
    const [filteredDataKurir, setFilteredDataKurir] = useState<KurirType[]>(data.kurir || []);
    const [filteredDataRevenue, setFilteredDataRevenue] = useState<revenue[]>(data.revenue || []);
    const [filteredDetail, setFilteredDetail] = useState<detail[]>(data.detail || []);
    const toggleDateRange = () => {
        setShowDateRange(!showDateRange);
    };
    const handleDateChange = ({ startDate, endDate }: { startDate: string; endDate: string }) => {
        setStartDate(startDate);
        setEndDate(endDate);
    };
    useEffect(() => {
        if (startDate && endDate) {
            if (!isValidDate(startDate) || !isValidDate(endDate)) {
                console.error("Tanggal tidak valid");
                return;
            }

            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            const isInRange = (dateStr: string) => {
                const parsedDate = new Date(dateStr);
                return parsedDate.getTime() >= start.getTime() && parsedDate.getTime() <= end.getTime();
            };

            const filterUser = data.user.filter((item) => isInRange(item.created_at));
            const filterKurir = data.kurir.filter((item) => isInRange(item.date_joined));
            const filterPengirimanCount = data.pengiriman_count.filter((item) => isInRange(item.date));
            const filterPengirimanSelesai = data.pengiriman_selesai_count.filter((item) => isInRange(item.date));
            const filterRevenue = data.revenue.filter((item) => isInRange(item.date));
            const filterDetail = data.detail.filter((item) => isInRange(item.created_at));

            setFilteredDataUser(filterUser);
            setFilteredDataKurir(filterKurir);
            setFilteredDataPengiriman(filterPengirimanCount);
            setFilteredDataPengirimanSelesai(filterPengirimanSelesai);
            setFilteredDataRevenue(filterRevenue);
            setFilteredDetail(filterDetail);
        } else {
            setFilteredDataUser(data.user);
            setFilteredDataKurir(data.kurir);
            setFilteredDataPengiriman(data.pengiriman_count);
            setFilteredDataPengirimanSelesai(data.pengiriman_selesai_count);
            setFilteredDataRevenue(data.revenue);
            setFilteredDetail(data.detail);
        }
    }, [startDate, endDate, data]);
    const totalPengiriman = filteredDataPengiriman.reduce((sum, item) => sum + item.count, 0);
    const totalPengirimanSelesai = filteredDataPengirimanSelesai.reduce((sum, item) => sum + item.count, 0);
    const totalRevenue = filteredDataRevenue.reduce((sum, item) => sum + item.total_tarif, 0);
    const totalRevenueFormatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(totalRevenue);

    const isDateRangeSelected = !!startDate && !!endDate;

    const dataToUse = isDateRangeSelected
        ? filteredDataPengiriman // jika user pilih tanggal, pakai semua data hasil filter
        : filteredDataPengiriman.slice(-20); // kalau belum pilih tanggal, ambil 10 data terakhir

    const totalPengirimanForChart = dataToUse.map((item: PengirimanItem) => ({
        date: item.date,
        count: Number(item.count)
    }));
    const getDataForChart = () => {
        return {
            labels: totalPengirimanForChart.map(item => item.date),
            datasets: [
                {
                    label: "Total Harga",
                    data: totalPengirimanForChart.map(item => item.count),
                    borderColor: "rgb(75, 192, 192)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)"
                },
            ]
        }
    }

    const groupedByKota: Record<string, GroupedKotaItem> = {};
    // Langkah 2: Grup berdasarkan kota
    filteredDetail.forEach(item => {
        const kota = item.kota;
        if (!groupedByKota[kota]) {
            groupedByKota[kota] = {
                kota: kota,
                total_tarif: 0,
                jumlah_pengiriman: 0,
                barang: []
            };
        }

        groupedByKota[kota].total_tarif += item.total_tarif;
        groupedByKota[kota].jumlah_pengiriman += 1;
        groupedByKota[kota].barang.push({
            id: item.id,
            detail_barang: item.detail_barang,
            total_tarif: item.total_tarif,
            created_at: item.created_at,
            nama_pengirim: item.nama_pengirim,
            nama_penerima: item.nama_penerima
        });
    });

    // Langkah 3: Ubah object ke array
    const groupedKotaArray: GroupedKotaItem[] = Object.values(groupedByKota);

    // Langkah 4: Hitung total jumlah
    const totalJumlah: number = groupedKotaArray.reduce(
        (sum, item) => sum + item.jumlah_pengiriman,
        0
    );

    // Langkah 5: Hitung persentase dan buat hasil akhir
    const result: KotaItem[] = groupedKotaArray.map(item => {
        const persentase = (item.jumlah_pengiriman / totalJumlah) * 100;
        return {
            kota: item.kota,
            jumlah: item.jumlah_pengiriman,
            persentase: persentase,
            total_tarif: item.total_tarif,
            barang: item.barang,
            totalJumlah: totalJumlah
        };
    });
    const ColumnsUser = [
        {
            name: 'nama',
            selector: (row: UserType) => row.nama,
            shortable: true,
        },
        {
            name: 'email',
            selector: (row: UserType) => row.email,
            shortable: true,
        },
        {
            name: 'no_telp',
            selector: (row: UserType) => row.no_telp,
            shortable: true,
        },
        {
            name: 'alamat',
            selector: (row: UserType) => row.alamat,
            shortable: true,
        },
        {
            name: 'kota',
            selector: (row: UserType) => row.kota,
            shortable: true,
        }
    ]
    const ColumnsKurir = [
        {
            name: 'nama',
            selector: (row: KurirType) => row.nama,
            shortable: true,
        },
        {
            name: 'no_telp',
            selector: (row: KurirType) => row.no_telp,
            shortable: true,
        },
        {
            name: 'email',
            selector: (row: KurirType) => row.email,
            shortable: true,
        },
        {
            name: 'status',
            selector: (row: KurirType) => row.status,
            shortable: true,
        }
    ]
    return (
        <section className="p-3">
            <header className={`${styles.header} d-flex justify-content-between`}>
                <h3 className={styles.header__h3}>Baligo</h3>
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
            <div className="row px-1 gap-4 justify-content-center mb-3">
                <div className={`${styles.largeCard} col-xl-2 col-12 card`}>
                    <div
                        className={`${styles.largeCard__content} d-flex align-items-center justify-content-center`}
                        onClick={() => setShowDetailUser(prev => !prev)}
                    >
                        <div className={`${styles.largeCard__content__leftSection} text-center`}>
                            <h2 className={`${styles.largeCard__content__leftSection__number}`}>{data.user_count}</h2>
                        </div>
                        <div className={`${styles.largeCard__content__rightSection} text-center`}>
                            <i className="fas fa-user icon"></i>
                        </div>
                    </div>
                    <p className={`${styles.largeCard__description} text-center`}>Total Pelanggan</p>
                </div>

                <div className={`${styles.largeCard} col-xl-2 col-12 card`}>
                    <div
                        className={`${styles.largeCard__content} d-flex align-items-center justify-content-center`}
                        onClick={() => setShowDetailKurir(prev => !prev)}
                    >
                        <div className={`${styles.largeCard__content__leftSection} text-center`}>
                            <h2 className={`${styles.largeCard__content__leftSection__number}`}>{data.kurir_count}</h2>
                        </div>
                        <div className={`${styles.largeCard__content__rightSection} text-center`}>
                            <i className="fas fa-person-walking icon"></i>
                        </div>
                    </div>
                    <p className={`${styles.largeCard__description} text-center`}>Total Kurir</p>
                </div>


                <div className={`${styles.largeCard} col-xl-2 col-12 card`}>
                    <div
                        className={`${styles.largeCard__content} d-flex align-items-center justify-content-center`}
                    >
                        <div className={`${styles.largeCard__content__leftSection} text-center`}>
                            <h2 className={`${styles.largeCard__content__leftSection__number}`}>{data.kendaraan_count}</h2>
                        </div>
                        <div className={`${styles.largeCard__content__rightSection} text-center`}>
                            <i className="fas fa-shipping-fast icon"></i>
                        </div>
                    </div>
                    <p className={`${styles.largeCard__description} text-center`}>Total Kendaraan</p>
                </div>
                <div className={`${styles.largeCard} col-xl-2 col-12 card`}>
                    <div
                        className={`${styles.largeCard__content} d-flex align-items-center justify-content-center`}
                    >
                        <div className={`${styles.largeCard__content__leftSection} text-center`}>
                            <h2 className={`${styles.largeCard__content__leftSection__number}`}>{totalPengiriman}</h2>
                        </div>
                        <div className={`${styles.largeCard__content__rightSection} text-center`}>
                            <i className="fas fa-dolly-flatbed icon"></i>
                        </div>
                    </div>
                    <p className={`${styles.largeCard__description} text-center`}>Total Proses Pengiriman</p>
                </div>
                <div className={`${styles.largeCard} col-xl-2 col-12 card`}>
                    <div
                        className={`${styles.largeCard__content} d-flex align-items-center justify-content-center`}
                    >
                        <div className={`${styles.largeCard__content__leftSection} text-center`}>
                            <h2 className={`${styles.largeCard__content__leftSection__number}`}>{totalPengirimanSelesai}</h2>
                        </div>
                        <div className={`${styles.largeCard__content__rightSection} text-center`}>
                            <i className="fas fa-box-open icon"></i>
                        </div>
                    </div>
                    <p className={`${styles.largeCard__description} text-center`}>Total Pengiriman Selesai</p>
                </div>
                <div className={`${styles.largeCard} col-xl-2 col-12 card`}>
                    <div
                        className={`${styles.largeCard__content} d-flex align-items-center justify-content-center`}
                    >
                        <div className={`${styles.largeCard__content__leftSection} text-center`}>
                            <h2 className={`${styles.largeCard__content__leftSection__number}`}>{totalRevenueFormatted}</h2>
                        </div>
                        <div className={`${styles.largeCard__content__rightSection} text-center`}>
                            <i className="fas fa-dollar-sign icon"></i>
                        </div>
                    </div>
                    <p className={`${styles.largeCard__description} text-center`}>Revenue</p>
                </div>
            </div>
            <div className="px-1 gap-4 justify-content-center mb-3">
                {showDetailUser && (
                    <div className="row g-4">
                        <div className="col-xl-12 col-md-12 col-sm-12">
                            <div className={`${styles.customCard} card`}>
                                <div className={styles.customCard__cardHeader}>
                                    <h6 className="mb-0">Data User</h6>
                                </div>
                                <div className={`${styles.customCard__cardBody} collapse show`}>
                                    <DataTable
                                        columns={ColumnsUser}
                                        data={filteredDataUser}
                                        pagination
                                        highlightOnHover
                                        striped
                                        responsive
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showDetailKurir && (
                    <div className="row g-4">
                        <div className="col-xl-12 col-md-12 col-sm-12">
                            <div className={`${styles.customCard} card`}>
                                <div className={styles.customCard__cardHeader}>
                                    <h6 className="mb-0">Data Kurir</h6>
                                </div>
                                <div className={`${styles.customCard__cardBody} collapse show`}>
                                    <DataTable
                                        columns={ColumnsKurir}
                                        data={filteredDataKurir}
                                        pagination
                                        highlightOnHover
                                        striped
                                        responsive
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="row g-4">
                    <div className="col-xl-12 col-md-12 col-sm-12">
                        <div className={`${styles.customCard} card`}>
                            <div className={styles.customCard__cardHeader}>
                                <h6 className="mb-0">Data Pengiriman</h6>
                            </div>
                            <div className={`${styles.customCard__cardBody} collapse show`}>
                                <LineChart
                                    chartData={getDataForChart()!}
                                    titleX="Tanggal"
                                    titleY="Total Pengiriman"
                                    isNominal={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row g-4">
                    <div className="col-xl-6 col-12">
                        <div className={`${styles.customCard} card`}>
                            <div className={styles.customCard__cardHeader}>
                                <h6 className="mb-0">Jumlah Pengiriman per Kota Tujuan</h6>
                            </div>
                            <div className={`${styles.customCard__cardBody} collapse show`}>
                                <DonutChartCenterText kotaData={result} />
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6 col-12">
                        <div className={`${styles.customCard} card`}>
                            <div className={styles.customCard__cardHeader}>
                                <h6 className="mb-0">Top 10 kategori</h6>
                            </div>
                            <div className={`${styles.customCard__cardBody} collapse show`}>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    )
};

export default BaligoView;