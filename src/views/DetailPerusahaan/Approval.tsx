import React, { useEffect, useState, useRef } from "react";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
import "datatables.net";
import "datatables.net-responsive";
import styles from "@/styles/Approval.module.scss";
import LineChart from "@/components/elements/Chart/LineChart";
import DateRangeInput from "@/components/elements/Daterange/Daterange";
import { ApprovalType } from "@/types/approval.type";

const ApprovalView = ({ data }: { data: any }) => {
    const [selectedChart, setSelectedChart] = useState<'semua' | 'approved' | 'belum diapprove' | 'ditolak'>('semua');
    const [originalData, setOriginalData] = useState(data.all || []);
    const tableRef = useRef<HTMLTableElement>(null);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [filteredChartData, setFilteredChartData] = useState<any[]>(data.total_harga || []);
    const [filteredChartApproved, setFilteredChartApproved] = useState<any[]>(data.total_approved);
    const [filteredChartBelumApprove, setFilteredChartBelumApprove] = useState<any[]>(data.total_belum);
    const [filteredChartDitolak, setFilteredChartDitolak] = useState<any[]>(data.total_ditolak);
    // Cek validitas tanggal
    const isValidDate = (date: string) => !isNaN(new Date(date).getTime());

    // Filtering data table & chart ketika tanggal berubah
    useEffect(() => {
        if (startDate && endDate) {
            if (!isValidDate(startDate) || !isValidDate(endDate)) {
                console.error("Tanggal tidak valid");
                return;
            }

            const start = new Date(startDate);
            const end = new Date(endDate);


            const filteredChart = data.total_harga.filter((item: any) => {
                const approvalDate = new Date(item.date_approval);
                return approvalDate >= start && approvalDate <= end;
            });
            const filteredChartApproved = data.total_approved.filter((item: any) => {
                const approvalDate = new Date(item.date_approval);
                return approvalDate >= start && approvalDate <= end;
            });
            const filteredChartBelumApprove = data.total_belum.filter((item: any) => {
                const approvalDate = new Date(item.date_approval);
                return approvalDate >= start && approvalDate <= end;
            });
            const filteredChartDitolak = data.total_ditolak.filter((item: any) => {
                const approvalDate = new Date(item.date_approval);
                return approvalDate >= start && approvalDate <= end;
            });

            setFilteredChartApproved(filteredChartApproved);
            setFilteredChartBelumApprove(filteredChartBelumApprove);
            setFilteredChartDitolak(filteredChartDitolak);
            setFilteredChartData(filteredChart);
        } else {
            setFilteredChartData(data.total_harga);
            setFilteredChartApproved(data.total_approved);
            setFilteredChartBelumApprove(data.total_belum);
            setFilteredChartDitolak(data.total_ditolak);
        }
    }, [startDate, endDate, data.total_approved, data.total_belum, data.total_ditolak, data.total_harga]);

    const handleDateChange = ({ startDate, endDate }: { startDate: string; endDate: string }) => {
        setStartDate(startDate);
        setEndDate(endDate);
    };

    // Setup DataTables
    useEffect(() => {
        if (tableRef.current && originalData.length > 0) { // Ganti filteredData dengan originalData
            const tableElement = $(tableRef.current);

            if (($.fn.DataTable as any).isDataTable(tableRef.current)) {
                tableElement.DataTable().clear().destroy();
            }

            const dataTable = tableElement.DataTable({
                responsive: true,
                autoWidth: false,
                paging: true,
                pageLength: 10,
                searching: true,
                info: true,
                language: {
                    searchPlaceholder: "Search...",
                    search: "",
                    emptyTable: "Belum ada data tersedia",
                },
                drawCallback: function () {
                    $('.dataTables_paginate > .pagination').addClass('pagination-sm');
                }
            });

            return () => {
                dataTable.destroy();
            };
        }
    }, [originalData]); // Perubahan di sini, gunakan originalData untuk dependensi
    // Trigger ulang hanya jika filteredData berubah


    // Data untuk Chart
    const dataForChart = filteredChartData.map((item: any, index: number) => ({
        date_approval: item.date_approval,
        total_harga: Number(item.total_harga),
        total_nego: Number(data.total_nego[index]?.total_nego || 0),
    }));
    const dataForChartApproved = filteredChartApproved.map((item: any, index: number) => ({
        date_approval: item.date_approval,
        total_approved: Number(item.total_harga),
        nego_approved: Number(item.total_nego || 0),
    }));
    const dataForChartBelumApproved = filteredChartBelumApprove.map((item: any, index: number) => ({
        date_approval: item.date_approval,
        total_belum: Number(item.total_harga),
        nego_belum: Number(item.total_nego || 0),
    }));
    const dataForChartDitolak = filteredChartDitolak.map((item: any, index: number) => ({
        date_approval: item.date_approval,
        total_ditolak: Number(item.total_harga),
        nego_ditolak: Number(item.total_nego || 0),
    }));
    // Pilih data chart berdasarkan selectedChart
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
                        data: dataForChartApproved.map(item => item.total_approved),
                        borderColor: "rgb(75, 192, 192)",
                        backgroundColor: "rgba(75, 192, 192, 0.2)"
                    },
                    {
                        label: "Nego Approved",
                        data: dataForChartApproved.map(item => item.nego_approved),
                        borderColor: "rgb(255, 99, 132)",
                        backgroundColor: "rgba(255, 99, 132, 0.2)"
                    }
                ]
            };
        } else if (selectedChart === 'belum diapprove') {
            return {
                labels: dataForChartBelumApproved.map(item => item.date_approval),
                datasets: [
                    {
                        label: "Total Belum Approved",
                        data: dataForChartBelumApproved.map(item => item.total_belum),
                        borderColor: "rgb(75, 192, 192)",
                        backgroundColor: "rgba(75, 192, 192, 0.2)"
                    },
                    {
                        label: "Nego Belum Approved",
                        data: dataForChartBelumApproved.map(item => item.nego_belum),
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
                        data: dataForChartDitolak.map(item => item.total_ditolak),
                        borderColor: "rgb(75, 192, 192)",
                        backgroundColor: "rgba(75, 192, 192, 0.2)"
                    },
                    {
                        label: "Nego Ditolak",
                        data: dataForChartDitolak.map(item => item.nego_ditolak),
                        borderColor: "rgb(255, 99, 132)",
                        backgroundColor: "rgba(255, 99, 132, 0.2)"
                    }
                ]
            };
        } else {
            // Default fallback biar typescript ga error
            return {
                labels: [],
                datasets: []
            };
        }
    };

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
        } else if (selectedChart === 'belum diapprove') {
            return [
                { title: "Total Keseluruhan SO", value: totalKeseluruhanBelumApproved, bg: "success" },
                { title: "Total Nego Keseluruhan SO", value: totalNegoKeseluruhanBelumApproved, bg: "warning" },
                { title: "Total Selisih Keseluruhan SO", value: totalSelisihKeseluruhanBelumApproved, bg: "secondary" }
            ];
        }
        else if (selectedChart === 'ditolak') {
            return [
                { title: "Total Keseluruhan SO", value: totalKeseluruhanDitolak, bg: "success" },
                { title: "Total Nego Keseluruhan SO", value: totalNegoKeseluruhanDitolak, bg: "warning" },
                { title: "Total Selisih Keseluruhan SO", value: totalSelisihKeseluruhanDitolak, bg: "secondary" }
            ];
        }
        return [];
    };

    // Hitung manual berdasarkan dataForChart, BUKAN filteredData
    const totalKeseluruhanSO = dataForChart.reduce((sum, item) => sum + (item.total_harga || 0), 0);
    const totalNegoKeseluruhanSO = dataForChart.reduce((sum, item) => sum + (item.total_nego || 0), 0);
    const totalSelisihKeseluruhanSO = totalKeseluruhanSO - totalNegoKeseluruhanSO;

    const totalKeseluruhanApproved = dataForChartApproved.reduce((sum, item) => sum + (item.total_approved || 0), 0);
    const totalNegoKeseluruhanApproved = dataForChartApproved.reduce((sum, item) => sum + (item.nego_approved || 0), 0);
    const totalSelisihKeseluruhanApproved = totalKeseluruhanApproved - totalNegoKeseluruhanApproved;

    const totalKeseluruhanBelumApproved = dataForChartBelumApproved.reduce((sum, item) => sum + (item.total_belum || 0), 0);
    const totalNegoKeseluruhanBelumApproved = dataForChartBelumApproved.reduce((sum, item) => sum + (item.nego_belum || 0), 0);
    const totalSelisihKeseluruhanBelumApproved = totalKeseluruhanBelumApproved - totalNegoKeseluruhanBelumApproved;

    const totalKeseluruhanDitolak = dataForChartDitolak.reduce((sum, item) => sum + (item.total_ditolak || 0), 0);
    const totalNegoKeseluruhanDitolak = dataForChartDitolak.reduce((sum, item) => sum + (item.nego_ditolak || 0), 0);
    const totalSelisihKeseluruhanDitolak = totalKeseluruhanDitolak - totalNegoKeseluruhanDitolak;
    return (
        <section className="p-3">
            <header className={`${styles.header} d-flex justify-content-between`}>
                <h3 className={`${styles.header__h3} flex-grow-1`}>Approval</h3>
            </header>

            <div className="row px-1 mb-2 gap-5 justify-content-end">
                <div className={`${styles.search} d-flex align-items-center justify-content-end gap-1`}>
                    <DateRangeInput onDateChange={handleDateChange} />
                </div>
            </div>

            {/* Cards */}
            <div className="row px-1 mb-3 gap-4 justify-content-center">
                <div className="d-flex flex-wrap gap-3 justify-content-center">
                    {["approved", "pending", "ditolak", "belum_diapprove"].map((status, idx) => (
                        <div key={status} className={`${styles.customCard} col-xl-3 col-12 card bg-${["success", "warning", "danger", "secondary"][idx]}`}>
                            <p className={styles.customCard__title}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </p>
                            <h2 className={styles.customCard__value}>{data[status]}</h2>
                        </div>
                    ))}
                </div>
            </div>

            {/* Statistik */}
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
                                        className={`btn btn-sm ${selectedChart === 'belum diapprove' ? 'btn-warning' : 'btn-outline-warning'}`}
                                        onClick={() => setSelectedChart('belum diapprove')}
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
                                {/* Statistik Cards */}
                                {getStats().map((stat, idx) => (
                                    <div key={idx} className={`${styles.statCard__statistic} col-xl-4 col-12 bg-${stat.bg}`}>
                                        <p>{stat.title}</p>
                                        <h3>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(stat.value)}</h3>
                                    </div>
                                ))}


                            </div>
                        </div>
                    </div>

                    {/* Tabel Data */}
                    <div className={`${styles.statCard} card mt-3`}>
                        <div className={styles.statCard__header}>
                            <h6 className="mb-0 d-flex justify-content-between align-items-center">
                                <span className={styles.statCard__header__title}>Data Approval</span>
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="row px-1 mb-2 justify-content-center">
                                <div className="table-responsive-wrapper" style={{ maxWidth: "920px" }}>
                                    <table id="dataTable" ref={tableRef} className="display table table-striped">
                                        <thead>
                                            <tr>
                                                <th>NO.SQ</th>
                                                <th>Total Harga</th>
                                                <th>Holding</th>
                                                <th>date_approval</th>
                                                <th>keterangan_sq</th>
                                                <th>keterangan</th>
                                                <th>status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(originalData) && originalData.length > 0 ? (
                                                originalData.map((item) => (
                                                    <tr key={`${item.no_sq}-${item.date_approval}`}> {/* Kombinasikan no_sq dan date_approval sebagai key */}
                                                        <td>{item.no_sq}</td>
                                                        <td>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(item.total_harga)}</td>
                                                        <td>{item.holding}</td>
                                                        <td>{item.date_approval}</td>
                                                        <td>{item.keterangan_sq}</td>
                                                        <td>{item.keterangan}</td>
                                                        <td>{item.status}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={7} className="text-center">No data available</td>
                                                </tr>
                                            )}


                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ApprovalView;
