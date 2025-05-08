import dynamic from 'next/dynamic';

import styles from "@/styles/baligo.module.scss";
import { baligoType } from "@/types/baligo.type";
import DateRangeInput from '@/components/elements/Daterange/Daterange';
import { useEffect,useState } from 'react';


const BaligoView = ({ data }: { data: baligoType }) => {
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const isValidDate = (date: string) => !isNaN(new Date(date).getTime());
    const [filteredDataPengiriman, setFilteredDataPengiriman] = useState<any[]>(data.pengiriman_count || []);
    const [filteredDataPengirimanSelesai, setFilteredDataPengirimanSelesai] = useState<any[]>(data.pengiriman_selesai_count || []);
    const [filteredDataRevenue, setFilteredDataRevenue] = useState<any[]>(data.revenue || []);

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
    
            // Normalisasi waktu jadi 00:00:00 untuk konsistensi
            const start = new Date(startDate);
            const end = new Date(endDate);
    
            // Set end date ke jam 23:59:59 agar tidak terpotong
            end.setHours(23, 59, 59, 999);
    
            const filterPengirimanCount = data.pengiriman_count.filter((item: any) => {
                const pengirimanDate = new Date(item.date);
                return pengirimanDate.getTime() >= start.getTime() && pengirimanDate.getTime() <= end.getTime();
            });
            const filterPengirimanSelesai = data.pengiriman_selesai_count.filter((item: any) => {
                const pengirimanDate = new Date(item.date);
                return pengirimanDate.getTime() >= start.getTime() && pengirimanDate.getTime() <= end.getTime();
            })
            const filterRevenue = data.revenue.filter((item: any) => {
                const pengirimanDate = new Date(item.date);
                return pengirimanDate.getTime() >= start.getTime() && pengirimanDate.getTime() <= end.getTime();
            })

            setFilteredDataPengiriman(filterPengirimanCount);
            setFilteredDataPengirimanSelesai(filterPengirimanSelesai);
            setFilteredDataRevenue(filterRevenue);
        } else {
            setFilteredDataPengiriman(data.pengiriman_count);
            setFilteredDataPengirimanSelesai(data.pengiriman_selesai_count);
            setFilteredDataRevenue(data.revenue);
        }
    }, [startDate, endDate, data.pengiriman_count, data.pengiriman_selesai_count, data.revenue]);
    

    const totalPengiriman = filteredDataPengiriman.reduce((sum, item) => sum + item.count, 0);
    const totalPengirimanSelesai = filteredDataPengirimanSelesai.reduce((sum, item) => sum + item.count, 0);
    const totalRevenue = filteredDataRevenue.reduce((sum, item) => sum + item.total_tarif, 0);
    const totalRevenueFormatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(totalRevenue);
    return (
        <section className="p-3">
            <header className={`${styles.header} d-flex justify-content-between`}>
                <h3 className={styles.header__h3}>Baligo</h3>
            </header>
            <div className="row px-1 mb-2 gap-5 justify-content-end">
                <div className={`${styles.search} d-flex align-items-center justify-content-end gap-1`}>
                    <DateRangeInput onDateChange={handleDateChange} />
                </div>
            </div>
            <div className="row px-1 gap-4 justify-content-center mb-3">
                <div className={`${styles.largeCard} col-xl-2 col-12 card`}>
                    <div
                        className={`${styles.largeCard__content} d-flex align-items-center justify-content-center`}
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
                            <h2 className={`${styles.largeCard__content__leftSection__number}`}>{ totalPengiriman}</h2>
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
                            <h2 className={`${styles.largeCard__content__leftSection__number}`}>{ totalPengirimanSelesai}</h2>
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
            <div className="card px-1 gap-4 justify-content-center mb-3">
                
            </div>
        </section>
    )
};

export default BaligoView;