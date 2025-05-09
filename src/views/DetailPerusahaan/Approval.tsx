import React, { useEffect, useState } from "react";
import styles from "@/styles/Approval.module.scss";
import LineChart from "@/components/elements/Chart/LineChart";
import DateRangeInput from "@/components/elements/Daterange/Daterange";
import dynamic from 'next/dynamic';
const DataTable = dynamic(() => import('react-data-table-component'), {
    ssr: false,
});
import { ApprovalData, TotalHarga, TotalApproved, TotalBelum, TotalDitolak, ApprovalItem, } from "@/types/approval.type";
interface Props {
    data: ApprovalData;
}
type Status = "approved" | "pending" | "ditolak" | "belum_diapprove";
const ApprovalView = ({ data }: Props) => {
    const statuses: Status[] = ["approved", "pending", "ditolak", "belum_diapprove"];
    const [selectedChart, setSelectedChart] = useState<'semua' | 'approved' | 'belum approve' | 'ditolak'>('semua');
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [filteredChartData, setFilteredChartData] = useState<TotalHarga[]>(data.total_harga || []);
    const [filteredChartApproved, setFilteredChartApproved] = useState<TotalApproved[]>(data.total_approved);
    const [filteredChartBelumApprove, setFilteredChartBelumApprove] = useState<TotalBelum[]>(data.total_belum);
    const [filteredChartDitolak, setFilteredChartDitolak] = useState<TotalDitolak[]>(data.total_ditolak);
    const [showDateRange, setShowDateRange] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [filteredItems, setFilteredItems] = useState<ApprovalItem[]>(data.all);
    const toggleDateRange = () => {
        setShowDateRange(!showDateRange);
    };

    const handleDateChange = ({ startDate, endDate }: { startDate: string; endDate: string }) => {
        setStartDate(startDate);
        setEndDate(endDate);
    };
    // Filter data based on selected date range
    useEffect(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            const filteredData = data.total_harga.filter((item: TotalHarga) => {
                const approvalDate = new Date(item.date_approval);
                return approvalDate >= start && approvalDate <= end;
            });

            const filteredApprovedData = data.total_approved.filter((item: TotalApproved) => {
                const approvalDate = new Date(item.date_approval);
                return approvalDate >= start && approvalDate <= end;
            });

            const filteredBelumApproveData = data.total_belum.filter((item: TotalBelum) => {
                const approvalDate = new Date(item.date_approval);
                return approvalDate >= start && approvalDate <= end;
            });

            const filteredDitolakData = data.total_ditolak.filter((item: TotalDitolak) => {
                const approvalDate = new Date(item.date_approval);
                return approvalDate >= start && approvalDate <= end;
            });

            setFilteredChartApproved(filteredApprovedData);
            setFilteredChartBelumApprove(filteredBelumApproveData);
            setFilteredChartDitolak(filteredDitolakData);
            // console.log("Filtered data:", filteredData);
            setFilteredChartData(filteredData);
        } else {
            setFilteredChartData(data.total_harga);
            setFilteredChartApproved(data.total_approved);
            setFilteredChartBelumApprove(data.total_belum);
            setFilteredChartDitolak(data.total_ditolak);
        }
    }, [startDate, endDate, data]);

    const dataForChart = filteredChartData.map((item: TotalHarga, index: number) => ({
        date_approval: item.date_approval,
        total_harga: Number(item.total_harga),
        total_nego: Number(data.total_nego[index]?.total_nego || 0),
    }));

    const dataForChartApproved = filteredChartApproved.map((item: TotalApproved, index: number) => ({
        date_approval: item.date_approval,
        total_harga: Number(item.total_harga),
        total_nego: Number(data.total_nego[index]?.total_nego || 0),
    }));

    const dataForChartBelumApprove = filteredChartBelumApprove.map((item: TotalBelum, index: number) => ({
        date_approval: item.date_approval,
        total_harga: Number(item.total_harga),
        total_nego: Number(data.total_nego[index]?.total_nego || 0),
    }));

    const dataForChartDitolak = filteredChartDitolak.map((item: TotalDitolak, index: number) => ({
        date_approval: item.date_approval,
        total_harga: Number(item.total_harga),
        total_nego: Number(data.total_nego[index]?.total_nego || 0),
    }));

    const getDataForChart = () => {
        if (selectedChart === 'semua') {
            return {
                labels: dataForChart.map(item => item.date_approval),
                datasets: [
                    {
                        label: "Total Harga",
                        data: dataForChart.map(item => item.total_harga),
                        borderColor: "rgb(75, 192, 192)",
                        backgroundColor: "rgba(75, 192, 192, 0.2)"
                    },
                    {
                        label: "Total Nego",
                        data: dataForChart.map(item => item.total_nego),
                        borderColor: "rgb(255, 99, 132)",
                        backgroundColor: "rgba(255, 99, 132, 0.2)"
                    }
                ]
            };
        } else if (selectedChart === 'approved') {
            return {
                labels: dataForChartApproved.map(item => item.date_approval),
                datasets: [
                    {
                        label: "Total Approved",
                        data: dataForChartApproved.map(item => item.total_harga),
                        borderColor: "rgb(75, 192, 192)",
                        backgroundColor: "rgba(75, 192, 192, 0.2)"
                    },
                    {
                        label: "Total Nego",
                        data: dataForChartApproved.map(item => item.total_nego),
                        borderColor: "rgb(255, 99, 132)",
                        backgroundColor: "rgba(255, 99, 132, 0.2)"
                    }
                ]
            };
        } else if (selectedChart === 'belum approve') {
            return {
                labels: dataForChartBelumApprove.map(item => item.date_approval),
                datasets: [
                    {
                        label: "Total Belum Approve",
                        data: dataForChartBelumApprove.map(item => item.total_harga),
                        borderColor: "rgb(75, 192, 192)",
                        backgroundColor: "rgba(75, 192, 192, 0.2)"
                    },
                    {
                        label: "Total Nego",
                        data: dataForChartBelumApprove.map(item => item.total_nego),
                        borderColor: "rgb(255, 99, 132)",
                        backgroundColor: "rgba(255, 99, 132, 0.2)"
                    }
                ]
            };
        } else if (selectedChart === 'ditolak') {
            return {
                labels: dataForChartDitolak.map(item => item.date_approval),
                datasets: [
                    {
                        label: "Total Ditolak",
                        data: dataForChartDitolak.map(item => item.total_harga),
                        borderColor: "rgb(75, 192, 192)",
                        backgroundColor: "rgba(75, 192, 192, 0.2)"
                    },
                    {
                        label: "Total Nego",
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

    const totalKeseluruhanDitolak = dataForChartDitolak.reduce((sum, item) => sum + (item.total_harga || 0), 0);
    const totalNegoKeseluruhanDitolak = dataForChartDitolak.reduce((sum, item) => sum + (item.total_nego || 0), 0);
    const totalSelisihKeseluruhanDitolak = totalKeseluruhanDitolak - totalNegoKeseluruhanDitolak;

    const getStats = () => {
        if (selectedChart === 'semua') {
            return [
                { title: "Total Keseluruhan SO", value: totalKeseluruhanSO, bg: "success" },
                { title: "Total Nego Keseluruhan SO", value: totalNegoKeseluruhanSO, bg: "warning" },
                { title: "Total Selisih Keseluruhan SO", value: totalSelisihKeseluruhanSO, bg: "secondary" }
            ];
        } else if (selectedChart === 'approved') {
            return [
                { title: "Total Keseluruhan SO", value: totalKeseluruhanApproved, bg: "success" },
                { title: "Total Nego Keseluruhan SO", value: totalNegoKeseluruhanApproved, bg: "warning" },
                { title: "Total Selisih Keseluruhan SO", value: totalSelisihKeseluruhanApproved, bg: "secondary" }
            ];
        } else if (selectedChart === 'belum approve') {
            return [
                { title: "Total Keseluruhan SO", value: totalKeseluruhanBelumApproved, bg: "success" },
                { title: "Total Nego Keseluruhan SO", value: totalNegoKeseluruhanBelumApproved, bg: "warning" },
                { title: "Total Selisih Keseluruhan SO", value: totalSelisihKeseluruhanBelumApproved, bg: "secondary" }
            ];
        } else if (selectedChart === 'ditolak') {
            return [
                { title: "Total Keseluruhan SO", value: totalKeseluruhanDitolak, bg: "success" },
                { title: "Total Nego Keseluruhan SO", value: totalNegoKeseluruhanDitolak, bg: "warning" },
                { title: "Total Selisih Keseluruhan SO", value: totalSelisihKeseluruhanDitolak, bg: "secondary" }
            ];
        }
        return [];
    };
    const columns = [
        {
            name: 'No SQ',
            selector: (row: ApprovalItem) => row.no_sq,
            sortable: true,
        },
        {
            name: 'Total Harga',
            selector: (row: ApprovalItem) => `Rp ${row.total_harga.toLocaleString()}`,
            sortable: true,
            right: true,
        },
        {
            name: 'Holding',
            selector: (row: ApprovalItem) => row.holding,
            sortable: true,
        },
        {
            name: 'Tanggal Approval',
            selector: (row: ApprovalItem) => row.date_approval,
            sortable: true,
        },
        {
            name: 'Status',
            selector: (row: ApprovalItem) => row.status,
            sortable: true,
        },
    ];
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterText(e.target.value);
    };

    // Hook useEffect untuk memfilter data setiap kali filterText berubah
    useEffect(() => {
        const filtered = data.all.filter(
            (item) =>
                item.no_sq.toLowerCase().includes(filterText.toLowerCase()) ||
                item.holding.toLowerCase().includes(filterText.toLowerCase()) ||
                item.status.toLowerCase().includes(filterText.toLowerCase())
        );
        setFilteredItems(filtered);
    }, [filterText, data.all]);
    return (
        <section className="p-3">
            <header className={`${styles.header} d-flex justify-content-between`}>
                <h3 className={`${styles.header__h3} flex-grow-1`}>Approval</h3>
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

            <div className="row px-1 mb-3 gap-4 justify-content-center">
                <div className="d-flex flex-wrap gap-3 justify-content-center">
                    {statuses.map((status, idx) => (
                        <div
                            key={status}
                            className={`${styles.customCard} col-xl-3 col-12 card bg-${["success", "warning", "danger", "secondary"][idx]}`}
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
                            <h5 className={styles.statCard__header__title}>Statistik</h5>
                        </div>
                        <div className="card-body">
                            <div className="row px-1 mb-2 gap-3 justify-content-center">
                                <div className="mt-3 d-flex gap-2 justify-content-end">
                                    <button
                                        className={`btn btn-sm ${selectedChart === 'semua' ? 'btn-primary' : 'btn-outline-primary'}`}
                                        onClick={() => setSelectedChart('semua')}
                                    >
                                        Semua
                                    </button>
                                    <button
                                        className={`btn btn-sm ${selectedChart === 'approved' ? 'btn-success' : 'btn-outline-success'}`}
                                        onClick={() => setSelectedChart('approved')}
                                    >
                                        Approved
                                    </button>
                                    <button
                                        className={`btn btn-sm ${selectedChart === 'belum approve' ? 'btn-warning' : 'btn-outline-warning'}`}
                                        onClick={() => setSelectedChart('belum approve')}
                                    >
                                        Belum Diapprove
                                    </button>
                                    <button
                                        className={`btn btn-sm ${selectedChart === 'ditolak' ? 'btn-danger' : 'btn-outline-danger'}`}
                                        onClick={() => setSelectedChart('ditolak')}
                                    >
                                        Ditolak
                                    </button>
                                </div>
                                <div className={styles.statChard__chartContainer}>
                                    <LineChart
                                        chartData={getDataForChart()!}
                                        titleX="Tanggal Approval"
                                        titleY="Total Harga dan Total Nego"
                                        isNominal={true}
                                    />
                                </div>
                                {getStats().map((stat, idx) => (
                                    <div key={idx} className={`${styles.statCard__statistic} col-xl-4 col-12 bg-${stat.bg}`}>
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
                                <span className={styles.statCard__header__title}>Data Approval</span>
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="row px-1 mb-2 justify-content-center" style={{ minWidth: '920px' }}>
                                <input
                                    type="text"
                                    placeholder="Cari berdasarkan No SQ, Holding, atau Status"
                                    className="form-control mb-3"
                                    value={filterText}
                                    onChange={handleFilterChange}
                                />

                                <DataTable
                                    title="Daftar Approval"
                                    columns={columns}
                                    data={filteredItems}
                                    pagination
                                    highlightOnHover
                                    striped
                                    responsive
                                    noHeader
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
};

export default ApprovalView;
