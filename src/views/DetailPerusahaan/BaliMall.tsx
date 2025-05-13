import styles from "@/styles/BaliMall.module.scss";
import { BalimallType, MerchantItem, OrderByDateItem, OrdersByCategory, StatesItem, } from "@/types/balimall.type";
import Barchart from "@/components/elements/Chart/Barchart";
import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
const DataTable = dynamic(() => import('react-data-table-component'), {
  ssr: false,
});
// import LineChartCurved from "@/components/elements/Chart/LineChartCurved";
import DateRangeInput from "@/components/elements/Daterange/Daterange";
import { formatRupiah } from "@/utils/formatRupiah";
import dayjs from 'dayjs';
import LineChartCurved from "@/components/elements/Chart/LineChartCurved";

interface BaliMallViewProps {
  data: BalimallType;
}
interface MergedCityData {
  city: string;
  total: number;
  total_nominal: number;
}
interface MergedMerchantData {
  merchant_name: string;
  total_orders: number;
  total_nominal: number;
}
interface MergedCategoryData {
  category_name: string;
  total_orders: number;
  total_nominal: number;
}
const BaliMallView: React.FC<BaliMallViewProps> = ({ data }) => {
  const [showTotalChart, setShowTotalChart] = useState(true);
  const [showTotalMerchant, setShowTotalMerchant] = useState(true);
  const [showDetail, setShowDetail] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [mergedDataCity, setMergedDataCity] = useState<MergedCityData[]>([]);
  const [MergedDataMerchant, setMergedDataMerchant] = useState<MergedMerchantData[]>([]);
  const [mergeredDataCategory, setMergeredDataCategory] = useState<MergedCategoryData[]>([]);
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

  const [filteredOrderByDate, setFilteredOrderByDate] = useState<OrderByDateItem[]>(data.totalOrderByDate || []);
  const [filteredOrderByState, setFilteredOrderByState] = useState<StatesItem[]>(data.states || []);
  const [filteredOrderByMerchant, setFilteredOrderByMerchant] = useState<MerchantItem[]>(data.merchant || []);
  const [filteredMerchantData, setFilteredMerchantData] = useState(MergedDataMerchant);
  const [filteredOrderByCategory, setFilteredOrderByCategory] = useState<OrdersByCategory[]>(data.ordersByCategory || []);

  useEffect(() => {
    if (startDate && endDate) {
      const filteredOrder = data.totalOrderByDate.filter((item) => {
        const date = new Date(item.date);
        return date >= new Date(startDate) && date <= new Date(endDate);
      });
      const filteredState = data.states.filter((item) => {
        const date = new Date(item.tanggal);
        return date >= new Date(startDate) && date <= new Date(endDate);
      });
      const filteredMerchant = data.merchant.filter((item) => {
        const date = new Date(item.tanggal);
        return date >= new Date(startDate) && date <= new Date(endDate);
      });
      const filteredCategory = data.ordersByCategory.filter((item) => {
        const date = new Date(item.tanggal);
        return date >= new Date(startDate) && date <= new Date(endDate);
      })
      setFilteredOrderByDate(filteredOrder);
      setFilteredOrderByState(filteredState);
      setFilteredOrderByMerchant(filteredMerchant);
      setFilteredOrderByCategory(filteredCategory);
    } else {
      setFilteredOrderByDate(data.totalOrderByDate);
      setFilteredOrderByState(data.states);
      setFilteredOrderByMerchant(data.merchant);
      setFilteredOrderByCategory(data.ordersByCategory);
    }
  }, [startDate, endDate, data.totalOrderByDate, data.states, data.merchant, data.ordersByCategory]);

  const totalOrder = filteredOrderByDate.reduce((total, item) => total + item.total_orders, 0);
  const totalNominal = filteredOrderByDate.reduce((total, item) => total + item.total_nominal, 0);
  // Gabungkan semua data dari tiap tanggal
  // Di dalam useEffect atau function lainnya, update tanpa deklarasi ulang
  useEffect(() => {
    const allCityData = filteredOrderByState.flatMap(item => item.data);
    const allMerchantData = filteredOrderByMerchant.flatMap(item => item.data);
    const allCategoryData = filteredOrderByCategory.flatMap(item => item.data);

    // Group data by city
    const groupedByCity = allCityData.reduce<Record<string, { total: number; total_nominal: number }>>((acc, item) => {
      if (!acc[item.city]) {
        acc[item.city] = { total: 0, total_nominal: 0 };
      }
      acc[item.city].total += item.total;
      acc[item.city].total_nominal += item.total_nominal;
      return acc;
    }, {});

    setMergedDataCity(
      Object.entries(groupedByCity).map(([city, data]) => ({
        city,
        total: data.total,
        total_nominal: data.total_nominal
      }))
    );

    const groupByCategory = allCategoryData.reduce<Record<string, { total: number; total_nominal: number }>>((acc, item) => {
      if (!acc[item.category_name]) {
        acc[item.category_name] = { total: 0, total_nominal: 0 };
      }
      acc[item.category_name].total += item.total_orders;
      acc[item.category_name].total_nominal += item.total_nominal;
      return acc;
    }, {});
    setMergeredDataCategory(
      Object.entries(groupByCategory).map(([category_name, data]) => ({
        category_name,
        total_orders: data.total,
        total_nominal: data.total_nominal
      }))
    )
    // Group data by merchant
    const groupedByMerchant = allMerchantData.reduce<Record<string, { total: number; total_nominal: number }>>((acc, item) => {
      if (!acc[item.merchant_name]) {
        acc[item.merchant_name] = { total: 0, total_nominal: 0 };
      }
      acc[item.merchant_name].total += item.total_orders;
      acc[item.merchant_name].total_nominal += item.total_nominal;
      return acc;
    }, {});

    const merchantTableData = Object.entries(groupedByMerchant).map(([merchant_name, data]) => ({
      merchant_name,
      total_orders: data.total,
      total_nominal: data.total_nominal
    }));

    setMergedDataMerchant(merchantTableData);

  }, [filteredOrderByState, filteredOrderByMerchant, filteredOrderByCategory]);
  const merchantColumns = [
    {
      name: 'Merchant',
      selector: row => row.merchant_name,
      sortable: true,
    },
    {
      name: 'Total Order',
      selector: row => row.total_orders,
      sortable: true,
      right: true,
    },
    {
      name: 'Total Nominal',
      selector: row => formatRupiah(row.total_nominal),
      sortable: true,
      right: true,
    },
  ];
  useEffect(() => {
    const filtered = MergedDataMerchant.filter(item =>
      item.merchant_name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredMerchantData(filtered);
  }, [searchText, MergedDataMerchant]);

  const groupOrdersByMonth = (orders: OrderByDateItem[]) => {
    const grouped: Record<string, { month: string, total_orders: number, total_nominal: number }> = {};
  
    orders.forEach((order) => {
      const month = dayjs(order.date).format('YYYY-MM');
      if (!grouped[month]) {
        grouped[month] = {
          month,
          total_orders: 0,
          total_nominal: 0,
        };
      }
  
      grouped[month].total_orders += order.total_orders;
      grouped[month].total_nominal += order.total_nominal;
    });
  
    return Object.values(grouped);
  };
  const groupedOrderByMonth = useMemo(() => {
    return groupOrdersByMonth(filteredOrderByDate);
  }, [filteredOrderByDate]);
  
  return (
    <section className="p-3">
      <header className={`${styles.header} d-flex justify-content-between`}>
        <h3 className={`${styles.header__h3} flex-grow-1`}>Bali Mall</h3>
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
        <div className={`${styles.cardLarge} col-xl-4 col-12 card shadow-card`}>
          <div className="card-header d-flex align-items-center justify-content-between">
            <i className={`${styles.cardLarge__iconStyle} fas fa-coins`}></i>
            <h3 className={styles.cardLarge__description}>Total Transaksi Berhasil</h3>
          </div>
          <div className="card-body d-flex align-items-center justify-content-center">
            <h3 className={styles.cardLarge__transactionValue}>
              {totalOrder}
            </h3>
          </div>
        </div>

        <div className={`${styles.cardLarge} col-xl-4 col-12 card shadow-card`}>
          <div className="card-header d-flex align-items-center justify-content-between">
            <i className={`${styles.cardLarge__iconStyle} fas fa-money-bill`}></i>
            <h3 className={styles.cardLarge__description}>Nominal Transaksi</h3>
          </div>
          <div className="card-body d-flex align-items-center justify-content-center">
            <h3 className={styles.cardLarge__transactionValue}>
              {formatRupiah(totalNominal)}
            </h3>

          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-xl-6 col-lg-6 col-md-12">
          <div className={`${styles.customCard} card`}>
            <div className={styles.customCard__cardHeader}>
              <h6 className="mb-0">Total Transaksi per Cabang</h6>
            </div>
            <div className={`${styles.customCard__cardBody} collapse show`} style={{ height: "485px" }}>
              <div
                id="stateCollapse"
                className={`${styles.customCard__chartContainer} d-flex align-items-center p-2 rounded shadow-sm bg-white gap-2`}
              >
                <button
                  className={`btn btn-sm ${showTotalChart ? 'btn-success' : 'btn-outline-success'} rounded-pill px-3`}
                  onClick={() => setShowTotalChart(true)}
                >
                  Total
                </button>
                <button
                  className={`btn btn-sm ${!showTotalChart ? 'btn-primary' : 'btn-outline-primary'} rounded-pill px-3`}
                  onClick={() => setShowTotalChart(false)}
                >
                  Nominal
                </button>
              </div>

              <div className={styles.customCard__chartContainer}>
                {showTotalChart ? (
                  <Barchart
                    chartData={{
                      labels: mergedDataCity.map((item) => item.city || "Tidak diketahui"),
                      datasets: [
                        {
                          label: "Total Order per Kota",
                          data: mergedDataCity.map((item) => item.total), // Tipe pasti: number[]
                          backgroundColor: "#10b981",
                        },
                      ],
                    }}
                    valueType="number"
                    titleX="Kota"
                    titleY="Total Order"
                  />
                ) : (
                  <Barchart
                    chartData={{
                      labels: mergedDataCity.map((item) => item.city || "Tidak diketahui"),
                      datasets: [
                        {
                          label: "Nominal Order per Kota",
                          data: mergedDataCity.map((item) => item.total_nominal), // Tipe pasti: number[]
                          backgroundColor: "#10b981",
                        },
                      ],
                    }}
                    valueType="currency"
                    titleX="Kota"
                    titleY="Nominal Order"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-6 col-lg-6 col-md-12">
          <div className={`${styles.customCard} card`}>
            <div className={styles.customCard__cardHeader}>
              <h6 className="mb-0 d-flex justify-content-between align-items-center">
                <span>Total dan Nominal Transaksi Per Merchant</span>
              </h6>
            </div>

            <div className={`${styles.customCard__cardBody} collapse show`}>
              <div
                id="merchantCollapse"
                className={`${styles.customCard__chartContainer} d-flex align-items-center p-2 rounded shadow-sm bg-white gap-2`}
              >
                <div className="d-flex gap-2">
                  <button
                    className={`btn btn-sm ${showTotalMerchant ? 'btn-success' : 'btn-outline-success'} rounded-pill px-3`}
                    onClick={() => setShowTotalMerchant(true)}
                  >
                    Total
                  </button>
                  <button
                    className={`btn btn-sm ${!showTotalMerchant ? 'btn-primary' : 'btn-outline-primary'} rounded-pill px-3`}
                    onClick={() => setShowTotalMerchant(false)}
                  >
                    Nominal
                  </button>
                </div>
                <button
                  className={`btn btn-sm ms-auto ${showDetail ? 'btn-secondary' : 'btn-outline-secondary'} rounded-pill px-3`}
                  onClick={() => setShowDetail(prev => !prev)}
                >
                  {showDetail ? 'Sembunyikan Detail' : 'Tampilkan Detail'}
                </button>
              </div>


              <div className={styles.customCard__chartContainer}>
                {showTotalMerchant ? (
                  <Barchart
                    chartData={{
                      labels: MergedDataMerchant.map((item) => item.merchant_name || "Tidak diketahui"),
                      datasets: [
                        {
                          label: "Total Order per Merchant",
                          data: MergedDataMerchant.map((item) => item.total_orders), // Tipe pasti: number[]
                          backgroundColor: "#10b981",
                        },
                      ],
                    }}
                    valueType="number"
                    titleX="Merchant"
                    titleY="Total Order"
                  />
                ) : (
                  <Barchart
                    chartData={{
                      labels: MergedDataMerchant.map((item) => item.merchant_name || "Tidak diketahui"),
                      datasets: [
                        {
                          label: "Nominal Order per Kota",
                          data: MergedDataMerchant.map((item) => item.total_nominal), // Tipe pasti: number[]
                          backgroundColor: "#10b981",
                        },
                      ],
                    }}
                    valueType="currency"
                    titleX="Kota"
                    titleY="Nominal Order"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {showDetail ? (
          <div className="col-xl-12 col-lg-12 col-md-12">
            <div className={`${styles.customCard} card`}>
              <div className={styles.customCard__cardHeader}>
                <h6 className="mb-0 d-flex justify-content-between align-items-center">
                  <span>Detail Transaksi Per Merchant</span>
                </h6>
              </div>
              <div className="card-body">
                <div>
                  <input
                    type="text"
                    placeholder="Cari merchant..."
                    className="form-control mb-3"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />

                  <DataTable
                    columns={merchantColumns}
                    data={filteredMerchantData}
                    pagination
                    highlightOnHover
                    striped
                    responsive
                  />
                </div>

              </div>
            </div>
          </div>
        ) : null}

      </div>
      <div className="row g-4 mt-2">
        <div className="col-xl-6 col-lg-6 col-md-12">
          <div className={`${styles.customCard} card`}>
            <div className={styles.customCard__cardHeader}>
              <h6 className="mb-0">Total Produk Terjual Berdasarkan Kategori</h6>
            </div>
            <div className={`${styles.customCard__cardBody} collapse show`}>
              <Barchart
                chartData={{
                  labels: mergeredDataCategory.map((item) => item.category_name),
                  datasets: [
                    {
                      label: `Total Order Tahun`,
                      data: mergeredDataCategory.map((item) => item.total_orders ?? 0),
                      backgroundColor: "#10b981",
                    },
                  ],
                }}
                valueType="number"
                titleX="Kategori"
                titleY="Total Order"
              />
            </div>
          </div>
        </div>

        <div className="col-xl-6 col-lg-6 col-md-12">
          <div className={`${styles.customCard} card`}>
            <div className={styles.customCard__cardHeader}>
              <h6 className="mb-0">Nominal Transaksi Berdasarkan Kategori</h6>
            </div>
            <div className={`${styles.customCard__cardBody} collapse show`}>
              <Barchart
                chartData={{
                  labels: mergeredDataCategory.map((item) => item.category_name),
                  datasets: [
                    {
                      label: `Total Order Tahun `,
                      data: mergeredDataCategory.map((item) => item.total_nominal ?? 0),
                      backgroundColor: "#10b981",
                    },
                  ],
                }}
                valueType="currency"
                titleX="Kategori"
                titleY="Nominal Order"
              />

            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-2">
        <div className="col-xl-12">
          <div className={`${styles.customCard} card`}>
            <div className={styles.customCard__cardHeader}>
              <h6 className="mb-0">Jumlah Transaksi per Bulan</h6>
            </div>
            <div className={`${styles.customCard__cardBody} collapse show`} style={{ height: "300px" }}>
              <LineChartCurved
                chartData={{
                  labels: groupedOrderByMonth.map((item) => item.month),
                  datasets: [
                    {
                      label: `Jumlah Transaksi Tahun `,
                      data: groupedOrderByMonth.map((item) => item.total_orders),
                      borderColor: "rgb(75, 192, 192)",
                      backgroundColor: "rgba(75, 192, 192, 0.2)",
                    },
                  ],
                }}
                titleX="Bulan"
                titleY="Total Transaksi"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-2">
        <div className="col-xl-12">
          <div className={`${styles.customCard} card`}>
            <div className={styles.customCard__cardHeader}>
              <h6 className="mb-0">Nominal Transaksi per Bulan</h6>

            </div>
            <div className={`${styles.customCard__cardBody} collapse show`} style={{ height: "300px" }}>
              <LineChartCurved
                chartData={{
                  labels: groupedOrderByMonth.map((item) => item.month),
                  datasets: [
                    {
                      label: `Nominal Transaksi Tahun `,
                      data: groupedOrderByMonth.map((item) => item.total_nominal),
                      borderColor: "#800020",
                      backgroundColor: "rgba(255, 99, 132, 0.2)",
                    },
                  ],
                }}
                titleX="Bulan"
                titleY="Nominal Transaksi"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BaliMallView;
