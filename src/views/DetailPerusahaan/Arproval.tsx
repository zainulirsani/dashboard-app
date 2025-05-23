import React, { useEffect, useState } from "react";
import styles from "@/styles/Arproval.module.scss";
import { FaRegCalendarAlt } from 'react-icons/fa';
import LineChart from "@/components/elements/Chart/LineChart";
import DateRangeInput from "@/components/elements/Daterange/Daterange";
import dynamic from 'next/dynamic';
const DataTable = dynamic(() => import('react-data-table-component'), {
    ssr: false,
});
import { ArprovalData, TotalHarga, TotalApproved, TotalBelum, TotalDitolak, ArprovalItem, TotalPending, } from "@/types/arproval.type";
interface Props {
    data: ArprovalData;
}
type Status = "approved" | "pending" | "rejected" | "not_approved";
const ArprovalView = ({ data }: Props) => {
    const statuses: Status[] = ["approved", "pending", "rejected", "not_approved"];
    const [selectedChart, setSelectedChart] = useState<'all' | 'approved' | 'pending' | 'not approved' | 'rejected'>('all');

    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [filteredChartData, setFilteredChartData] = useState<TotalHarga[]>(data.total_harga || []);
    const [filteredChartApproved, setFilteredChartApproved] = useState<TotalApproved[]>(data.total_approved);
    const [filteredChartPending, setFilteredChartPending] = useState<TotalPending[]>(data.total_pending);
    const [filteredChartBelumApprove, setFilteredChartBelumApprove] = useState<TotalBelum[]>(data.total_belum);
    const [filteredChartDitolak, setFilteredChartDitolak] = useState<TotalDitolak[]>(data.total_ditolak);

    const [showDateRange, setShowDateRange] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [filteredItems, setFilteredItems] = useState<ArprovalItem[]>(data.all);
    const toggleDateRange = () => {
        setShowDateRange(!showDateRange);
    };

    const handleDateChange = ({ startDate, endDate }: { startDate: string; endDate: string }) => {
        setStartDate(startDate);
        setEndDate(endDate);
    };
    useEffect(() => {
        if (data.total_harga && data.total_harga.length > 0) {
            // Ambil semua tahun dari data
            const years = data.total_harga
                .map(item => new Date(item.date_arproval).getFullYear())
                .filter(year => !isNaN(year));

            // Cari tahun terbesar
            const latestYear = Math.max(...years);

            // Set default start dan end date berdasarkan tahun terakhir
            const defaultStartDate = `${latestYear}-01-01`;
            const defaultEndDate = `${latestYear}-12-31`;

            setStartDate(defaultStartDate);
            setEndDate(defaultEndDate);
        }
    }, [data.total_harga]);

    // Filter data based on selected date range
    useEffect(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            const filteredData = data.total_harga.filter((item: TotalHarga) => {
                const arprovalDate = new Date(item.date_arproval);
                return arprovalDate >= start && arprovalDate <= end;
            });

            const filteredApprovedData = data.total_approved.filter((item: TotalApproved) => {
                const arprovalDate = new Date(item.date_arproval);
                return arprovalDate >= start && arprovalDate <= end;
            });

            const filteredBelumApproveData = data.total_belum.filter((item: TotalBelum) => {
                const arprovalDate = new Date(item.date_arproval);
                return arprovalDate >= start && arprovalDate <= end;
            });

            const filteredPendingData = data.total_pending.filter((item: TotalPending) => {
                const arprovalDate = new Date(item.date_arproval);
                return arprovalDate >= start && arprovalDate <= end;
            });

            const filteredDitolakData = data.total_ditolak.filter((item: TotalDitolak) => {
                const arprovalDate = new Date(item.date_arproval);
                return arprovalDate >= start && arprovalDate <= end;
            });

            setFilteredChartApproved(filteredApprovedData);
            setFilteredChartBelumApprove(filteredBelumApproveData);
            setFilteredChartDitolak(filteredDitolakData);
            setFilteredChartPending(filteredPendingData);
            // console.log("Filtered data:", filteredData);
            setFilteredChartData(filteredData);
        } else {
            setFilteredChartData(data.total_harga);
            setFilteredChartApproved(data.total_approved);
            setFilteredChartBelumApprove(data.total_belum);
            setFilteredChartPending(data.total_pending);
            setFilteredChartDitolak(data.total_ditolak);
        }
    }, [startDate, endDate, data]);

    const dataForChart = filteredChartData.map((item: TotalHarga, index: number) => ({
        date_arproval: item.date_arproval,
        total_harga: Number(item.total_harga),
        total_nego: Number(data.total_nego[index]?.total_nego || 0),
    }));

    const dataForChartApproved = filteredChartApproved.map((item: TotalApproved, index: number) => ({
        date_arproval: item.date_arproval,
        total_harga: Number(item.total_harga),
        total_nego: Number(data.total_nego[index]?.total_nego || 0),
    }));

    const dataForChartPending = filteredChartPending.map((item: TotalPending, index: number) => ({
        date_arproval: item.date_arproval,
        total_harga: Number(item.total_harga),
        total_nego: Number(data.total_nego[index]?.total_nego || 0),
    }))

    const dataForChartBelumApprove = filteredChartBelumApprove.map((item: TotalBelum, index: number) => ({
        date_arproval: item.date_arproval,
        total_harga: Number(item.total_harga),
        total_nego: Number(data.total_nego[index]?.total_nego || 0),
    }));

    const dataForChartDitolak = filteredChartDitolak.map((item: TotalDitolak, index: number) => ({
        date_arproval: item.date_arproval,
        total_harga: Number(item.total_harga),
        total_nego: Number(data.total_nego[index]?.total_nego || 0),
    }));

    const getDataForChart = () => {
        if (selectedChart === 'all') {
            return {
                labels: dataForChart.map(item => item.date_arproval),
                datasets: [
                    {
                        label: "Total Price",
                        data: dataForChart.map(item => item.total_harga),
                        borderColor: "rgb(75, 192, 192)",
                        backgroundColor: "rgba(75, 192, 192, 0.2)"
                    },
                    {
                        label: "Negotiated Total ",
                        data: dataForChart.map(item => item.total_nego),
                        borderColor: "rgb(255, 99, 132)",
                        backgroundColor: "rgba(255, 99, 132, 0.2)"
                    }
                ]
            };
        } else if (selectedChart === 'approved') {
            return {
                labels: dataForChartApproved.map(item => item.date_arproval),
                datasets: [
                    {
                        label: "Total Price",
                        data: dataForChartApproved.map(item => item.total_harga),
                        borderColor: "rgb(75, 192, 192)",
                        backgroundColor: "rgba(75, 192, 192, 0.2)"
                    },
                    {
                        label: "Negotiated Total",
                        data: dataForChartApproved.map(item => item.total_nego),
                        borderColor: "rgb(255, 99, 132)",
                        backgroundColor: "rgba(255, 99, 132, 0.2)"
                    }
                ]
            };
        } else if (selectedChart === 'not approved') {
            return {
                labels: dataForChartBelumApprove.map(item => item.date_arproval),
                datasets: [
                    {
                        label: "Total Price",
                        data: dataForChartBelumApprove.map(item => item.total_harga),
                        borderColor: "rgb(75, 192, 192)",
                        backgroundColor: "rgba(75, 192, 192, 0.2)"
                    },
                    {
                        label: "Negotiated Total ",
                        data: dataForChartBelumApprove.map(item => item.total_nego),
                        borderColor: "rgb(255, 99, 132)",
                        backgroundColor: "rgba(255, 99, 132, 0.2)"
                    }
                ]
            };
        } else if (selectedChart === 'pending') {
            return {
                labels: dataForChartPending.map(item => item.date_arproval),
                datasets: [
                    {
                        label: "Total Price",
                        data: dataForChartPending.map(item => item.total_harga),
                        borderColor: "rgb(75, 192, 192)",
                        backgroundColor: "rgba(75, 192, 192, 0.2)"
                    },
                    {
                        label: "Negotiated Total ",
                        data: dataForChartPending.map(item => item.total_nego),
                        borderColor: "rgb(255, 99, 132)",
                        backgroundColor: "rgba(255, 99, 132, 0.2)"
                    }
                ]
            };
        }
        else if (selectedChart === 'rejected') {
            return {
                labels: dataForChartDitolak.map(item => item.date_arproval),
                datasets: [
                    {
                        label: "Total Price",
                        data: dataForChartDitolak.map(item => item.total_harga),
                        borderColor: "rgb(75, 192, 192)",
                        backgroundColor: "rgba(75, 192, 192, 0.2)"
                    },
                    {
                        label: "Negotiated Total ",
                        data: dataForChartDitolak.map(item => item.total_nego),
                        borderColor: "rgb(255, 99, 132)",
                        backgroundColor: "rgba(255, 99, 132, 0.2)"
                    }
                ]
            };
        }
        else {
            return { labels: [], datasets: [] }; // Default fallback
        }
    };

    const totalKeseluruhanSO = dataForChart.reduce((sum, item) => sum + (item.total_harga || 0), 0);
    const totalNegoKeseluruhanSO = dataForChart.reduce((sum, item) => sum + (item.total_nego || 0), 0);
    const totalSelisihKeseluruhanSO = totalKeseluruhanSO - totalNegoKeseluruhanSO;

    const totalKeseluruhanApproved = dataForChartApproved.reduce((sum, item) => sum + (item.total_harga || 0), 0);
    const totalNegoKeseluruhanApproved = dataForChartApproved.reduce((sum, item) => sum + (item.total_nego || 0), 0);
    const totalSelisihKeseluruhanApproved = totalKeseluruhanApproved - totalNegoKeseluruhanApproved;

    const totalKeseluruhanBelumApproved = dataForChartBelumApprove.reduce((sum, item) => sum + (item.total_harga || 0), 0);
    const totalNegoKeseluruhanBelumApproved = dataForChartBelumApprove.reduce((sum, item) => sum + (item.total_nego || 0), 0);
    const totalSelisihKeseluruhanBelumApproved = totalKeseluruhanBelumApproved - totalNegoKeseluruhanBelumApproved;

    const totalKeseluruhanPending = dataForChartPending.reduce((sum, item) => sum + (item.total_harga || 0), 0);
    const totalNegoKeseluruhanPending = dataForChartPending.reduce((sum, item) => sum + (item.total_nego || 0), 0);
    const totalSelisihKeseluruhanPending = totalKeseluruhanPending - totalNegoKeseluruhanPending;

    const totalKeseluruhanDitolak = dataForChartDitolak.reduce((sum, item) => sum + (item.total_harga || 0), 0);
    const totalNegoKeseluruhanDitolak = dataForChartDitolak.reduce((sum, item) => sum + (item.total_nego || 0), 0);
    const totalSelisihKeseluruhanDitolak = totalKeseluruhanDitolak - totalNegoKeseluruhanDitolak;

    const getStats = () => {
        if (selectedChart === 'all') {
            return [
                { title: "Total Overall SO", value: totalKeseluruhanSO, bg: "success" },
                { title: "Total Overall SO Negotiated", value: totalNegoKeseluruhanSO, bg: "warning" },
                { title: "Total Overall SO Difference", value: totalSelisihKeseluruhanSO, bg: "secondary" }
            ];
        } else if (selectedChart === 'approved') {
            return [
                { title: "Total Approved SO", value: totalKeseluruhanApproved, bg: "success" },
                { title: "Total Approved SO Negotiated", value: totalNegoKeseluruhanApproved, bg: "warning" },
                { title: "Total Approved SO Difference", value: totalSelisihKeseluruhanApproved, bg: "secondary" }
            ];
        } else if (selectedChart === 'not approved') {
            return [
                { title: "Total Unapproved SO", value: totalKeseluruhanBelumApproved, bg: "success" },
                { title: "Total Unapproved SO Negotiated", value: totalNegoKeseluruhanBelumApproved, bg: "warning" },
                { title: "Total Unapproved SO Difference", value: totalSelisihKeseluruhanBelumApproved, bg: "secondary" }
            ];
        } else if (selectedChart === 'pending') {
            return [
                { title: "Total Pending SO", value: totalKeseluruhanPending, bg: "success" },
                { title: "Total Pending SO Negotiated", value: totalNegoKeseluruhanPending, bg: "warning" },
                { title: "Total Pending SO Difference", value: totalSelisihKeseluruhanPending, bg: "secondary" }
            ];
        } else if (selectedChart === 'rejected') {
            return [
                { title: "Total Rejected SO", value: totalKeseluruhanDitolak, bg: "success" },
                { title: "Total Rejected SO Negotiated", value: totalNegoKeseluruhanDitolak, bg: "warning" },
                { title: "Total Rejected SO Difference", value: totalSelisihKeseluruhanDitolak, bg: "secondary" }
            ];
        }
        return [];
    };

    const columns = [
        {
            name: 'No SQ',
            selector: (row: ArprovalItem) => row.no_sq,
            sortable: true,
        },
        {
            name: 'Total Price',
            selector: (row: ArprovalItem) => `Rp ${row.total_harga.toLocaleString()}`,
            sortable: true,
            right: true,
        },
        {
            name: 'Holding',
            selector: (row: ArprovalItem) => row.holding,
            sortable: true,
        },
        {
            name: 'Arproval Date',
            selector: (row: ArprovalItem) => row.date_arproval,
            sortable: true,
        },
        {
            name: 'Status',
            selector: (row: ArprovalItem) => row.status,
            sortable: true,
        },
    ];
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterText(e.target.value);
    };

    // Hook useEffect untuk memfilter data setiap kali filterText berubah
    useEffect(() => {
        const filtered = data.all.filter((item) =>
            item.no_sq.toLowerCase().includes(filterText.toLowerCase()) ||
            item.holding.toLowerCase().includes(filterText.toLowerCase()) ||
            String(item.date_arproval).toLowerCase().includes(filterText.toLowerCase()) ||
            item.status.toLowerCase().includes(filterText.toLowerCase())
          );
          
        setFilteredItems(filtered);
    }, [filterText, data.all]);
    return (
        <section className="p-3">
            <header className={`${styles.header} d-flex justify-content-between`}>
                <h3 className={`${styles.header__h3} flex-grow-1`}>Arproval</h3>
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

            <div className="row px-1 mb-3 gap-4 justify-content-center">
                <div className="d-flex flex-wrap gap-3 justify-content-center">
                    {statuses.map((status, idx) => (
                        <div
                            key={status}
                            className={`${styles.customCard} ${styles[`bgColor${idx}`]} col-xl-3 col-12 card`}
                        >
                            <p className={styles.customCard__title}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </p>
                            <h2 className={styles.customCard__value}>{data[status]}</h2>
                        </div>
                    ))}
                </div>

            </div>

            <div className="row px-1 mb-3 gap-4 justify-content-center">
                <div className="d-flex flex-wrap gap-3">
                    <div className={`${styles.statCard} card`}>
                        <div className={styles.statCard__header}>
                            <h5 className={styles.statCard__header__title}>Statistics</h5>
                        </div>
                        <div className="card-body">
                            <div className="row px-1 mb-2 gap-3 justify-content-center">
                                <div className="mt-3 d-flex gap-2 flex-wrap justify-content-center">
                                    <button
                                        className={`btn btn-sm ${selectedChart === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                                        onClick={() => setSelectedChart('all')}
                                    >
                                        All
                                    </button>
                                    <button
                                        className={`btn btn-sm ${selectedChart === 'approved' ? 'btn-success' : 'btn-outline-success'}`}
                                        onClick={() => setSelectedChart('approved')}
                                    >
                                        Approved
                                    </button>
                                    <button
                                        className={`btn btn-sm ${selectedChart === 'pending' ? 'btn-warning' : 'btn-outline-warning'}`}
                                        onClick={() => setSelectedChart('pending')}
                                    >
                                        Pending
                                    </button>
                                    <button
                                        className={`btn btn-sm ${selectedChart === 'rejected' ? 'btn-danger' : 'btn-outline-danger'}`}
                                        onClick={() => setSelectedChart('rejected')}
                                    >
                                        Rejected
                                    </button>
                                    <button
                                        className={`btn btn-sm ${selectedChart === 'not approved' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                                        onClick={() => setSelectedChart('not approved')}
                                    >
                                        Not Approved
                                    </button>
                                </div>

                                <div className={styles.statChard__chartContainer}>
                                    <LineChart
                                        chartData={getDataForChart()!}
                                        titleX="Approval Date"
                                        titleY="Total Price and Total Negotiated"
                                        isNominal={true}
                                    />
                                </div>
                                {getStats().map((stat, idx) => (
                                    <div key={idx} className={`${styles.statCard__statistic} col-xl-4 col-12 ${styles[`bgColor${idx}`]}`}>
                                        <p>{stat.title}</p>
                                        <h3>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(stat.value)}</h3>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.statCard} card mt-3`}>
                        <div className={styles.statCard__header}>
                            <h6 className="mb-0 d-flex justify-content-between align-items-center">
                                <span className={styles.statCard__header__title}>Arproval Data</span>
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="row px-1 mb-2 justify-content-center">
                                <input
                                    type="text"
                                    placeholder="Search by SQ Number, Holding, or Status"
                                    className="form-control mb-3"
                                    value={filterText}
                                    onChange={handleFilterChange}
                                />

                                {/* Tabel scrollable */}
                                <div style={{ overflowX: "auto", width: "100%" }}>
                                    <div style={{ minWidth: "800px" }}>
                                        <DataTable
                                            title="Daftar Arproval"
                                            columns={columns}
                                            data={filteredItems}
                                            pagination
                                            highlightOnHover
                                            striped
                                            noHeader
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </section>
    );
};

export default ArprovalView;
