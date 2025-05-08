import styles from "@/styles/BaliMall.module.scss";
import { BalimallType } from "@/types/balimall.type";
import Barchart from "@/components/elements/Chart/Barchart";
import DateYearInput from "@/components/elements/Daterange/DateYear";
import React, { useEffect, useState } from 'react';
import LineChartCurved from "@/components/elements/Chart/LineChartCurved";

interface BaliMallViewProps {
  data: BalimallType;
}

interface YearData {
  total_nominal: {
    total_orders: number
    total_nominal: number
  }
}

interface MonthlyData {
  total: {
    bulan: string;
    total: number;
  };
}
type CategoryData = {
  total_orders: {
    category_name: string;
    total_orders: number;
  }
  total_nominal: {
    category_name: string;
    total_nominal: number;
  }
};

interface StateData {
  city: string;
  total: number;
}

interface MerchantData {
  merchant_name: string;
  total_orders: number;
  total_nominal: number;
}

const BaliMallView: React.FC<BaliMallViewProps> = ({ data }) => {
  const [showTotalChart, setShowTotalChart] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  const [filteredTotalData, setFilteredTotalData] = useState<YearData[]>([]);
  const [filteredData, setFilteredData] = useState<MonthlyData[]>([]);
  const [filteredNominalData, setFilteredNominalData] = useState<MonthlyData[]>([]);
  const [filteredTotalDataByCategory, setFilteredTotalDataByCategory] = useState<CategoryData[]>([]);
  const [filteredNominalDataByCategory, setFilteredNominalDataByCategory] = useState<CategoryData[]>([]);
  const [filteredTotalDataByState, setFilteredTotalDataByState] = useState<StateData[]>([]);
  const [filteredTotalDataByMerchant, setFilteredTotalDataByMerchant] = useState<MerchantData[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  useEffect(() => {
    if (data?.result?.total_order_by_year) {
      const yearsWithData = data.result.total_order_by_year
        .filter((item: any) => {
          // Pastikan ada data dalam array
          const hasData = Array.isArray(item.data) && item.data.length > 0;

          // Periksa apakah di dalam data tersebut ada total_orders > 0
          const hasValidOrders = hasData && item.data.some((entry: any) => entry.total_orders > 0);

          return hasValidOrders;
        })
        .map((item: any) => item.tahun); // Ambil tahun dari yang lolos filter

      setAvailableYears(yearsWithData);
      if (!selectedYear && yearsWithData.length > 0) {
        const latestYear = Math.max(...yearsWithData);
        setSelectedYear(latestYear);
      }
    }
  }, [data, selectedYear]);

  useEffect(() => {
    if (selectedYear && data?.result) {

      const total = data.result.total_order_by_year?.find((item: any) => item.tahun === selectedYear);
      const transaksi = data.result.total_order_by_month?.find((item: any) => item.tahun === selectedYear);
      const nominal = data.result.total_nominal_by_month?.find((item: any) => item.tahun === selectedYear);
      const totalByCategory = data.result.total_orders_by_category?.find((item: any) => item.tahun === selectedYear);
      const nominalByCategory = data.result.total_nominal_by_category?.find((item: any) => item.tahun === selectedYear);

      // Cek apakah states & merchant ada
      const totalByState = data.result.states?.find?.((item: any) => item.tahun === selectedYear);
      const totalByMerchant = data.result.merchant?.find?.((item: any) => item.tahun === selectedYear);

      const totalData = total?.data ?? {};
      const transaksiData = transaksi?.data ?? {};
      const nominalData = nominal?.data ?? {};
      const totalByCategoryData = totalByCategory?.data ?? {};
      const nominalByCategoryData = nominalByCategory?.data ?? {};
      const totalByStateData = totalByState?.data || [];
      const totalByMerchantData = totalByMerchant?.data ?? [];


      // Safe mapping with default empty array if data is not object
      const formattedTotal = Object.entries(totalData ?? {}).map(
        ([total_orders, total_nominal]: any) => ({ total_orders, total_nominal })
      )
      const formattedTransaksi = Object.entries(transaksiData ?? {}).map(
        ([bulan, total]: any) => ({ bulan, total })
      );
      const formattedNominal = Object.entries(nominalData ?? {}).map(
        ([bulan, total]: any) => ({ bulan, total })
      );
      const formattedTotalByCategory = Object.entries(totalByCategoryData ?? {}).map(
        ([category_name, total_orders]: any) => ({ category_name, total_orders })
      );
      const formattedNominalByCategory = Object.entries(nominalByCategoryData ?? {}).map(
        ([category_name, total_nominal]: any) => ({ category_name, total_nominal })
      );
      const formattedTotalByState = Array.isArray(totalByStateData)
        ? totalByStateData.map((item: any) => ({
          city: item.city,
          total: item.total,
        }))
        : [];



        const formattedTotalByMerchant = Array.isArray(totalByMerchantData)
        ? totalByMerchantData.map((item: MerchantData) => ({
            merchant_name: item.merchant_name,
            total_orders: item.total_orders,
            total_nominal: item.total_nominal
          }))
        : [];      
      const mergedCategoryData: CategoryData[] = formattedTotalByCategory.map(totalItem => {
        const nominalItem = formattedNominalByCategory.find(n => n.category_name === totalItem.category_name);
        return {
          category_name: totalItem.category_name,
          total_orders: totalItem.total_orders,
          total_nominal: nominalItem?.total_nominal ?? 0,
        };
      });

      setFilteredTotalData(formattedTotal);
      setFilteredData(formattedTransaksi);
      setFilteredNominalData(formattedNominal);
      setFilteredTotalDataByCategory(mergedCategoryData);
      setFilteredNominalDataByCategory(mergedCategoryData); // Jika berbeda nanti bisa dipisah
      setFilteredTotalDataByState(formattedTotalByState);
      setFilteredTotalDataByMerchant(formattedTotalByMerchant);
    } else {
      // Kosongkan semua jika tidak ada tahun
      setFilteredTotalData([]);
      setFilteredData([]);
      setFilteredNominalData([]);
      setFilteredTotalDataByCategory([]);
      setFilteredNominalDataByCategory([]);
      setFilteredTotalDataByState([]);
      setFilteredTotalDataByMerchant([]);
    }
  }, [data, selectedYear]);


  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  return (
    <section className="p-3">
      <header className={`${styles.header} d-flex justify-content-between`}>
        <h3 className={`${styles.header__h3} flex-grow-1`}>Bali Mall</h3>
        <div className="d-flex align-items-center justify-content-end gap-1">
          <DateYearInput value={selectedYear} onChange={handleYearChange} options={availableYears} />
        </div>
      </header>
      <div className="row px-1 gap-4 justify-content-center mb-3">
        <div className={`${styles.cardLarge} col-xl-4 col-12 card shadow-card`}>
          <div className="card-header d-flex align-items-center justify-content-between">
            <i className={`${styles.cardLarge__iconStyle} fas fa-coins`}></i>
            <h3 className={styles.cardLarge__description}>Total Transaksi Berhasil</h3>
          </div>
          <div className="card-body d-flex align-items-center justify-content-center">
            <h3 className={styles.cardLarge__transactionValue}>
              {new Intl.NumberFormat("id-ID").format(filteredTotalData[0]?.total_nominal?.total_orders ?? 0)}
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
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(filteredTotalData[0]?.total_nominal.total_nominal ?? 0)}
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
              <div className={styles.customCard__chartContainer}>
                <Barchart
                  chartData={{
                    labels: filteredTotalDataByState.map((item) => item.city ?? ""),
                    datasets: [
                      {
                        label: `Total Order Tahun ${selectedYear || ""}`,
                        data: filteredTotalDataByState.map((item) => item.total ?? 0),
                        backgroundColor: "#10b981",
                      },
                    ],
                  }}
                  valueType="number"
                  titleX="State"
                  titleY="Total Order"
                />
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

            <div id="chartCollapse" className={`${styles.customCard__cardBody} collapse show`}>
              <div className="d-flex justify-content-center mb-3">
                <button
                  className={`btn btn-sm me-2 ${showTotalChart ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setShowTotalChart(true)}
                >
                  Total Orders
                </button>
                <button
                  className={`btn btn-sm ${!showTotalChart ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setShowTotalChart(false)}
                >
                  Nominal Orders
                </button>
              </div>

              <div className={styles.customCard__chartContainer}>
                {showTotalChart ? (

                  <Barchart
                    chartData={{
                      labels: filteredTotalDataByMerchant.map(item => item.merchant_name),
                      datasets: [
                        {
                          label: `Total Order Tahun ${selectedYear || ""}`,
                          data: filteredTotalDataByMerchant.map(item => item.total_orders ?? 0),
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
                      labels: filteredTotalDataByMerchant.map(item => item.merchant_name),
                      datasets: [
                        {
                          label: `Nominal Order Tahun ${selectedYear || ""}`,
                          data: filteredTotalDataByMerchant.map(item => item.total_nominal ?? 0),
                          backgroundColor: "#3b82f6",
                        },
                      ],
                    }}
                    valueType="currency"
                    titleX="Merchant"
                    titleY="Nominal Order"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
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
                  labels: filteredTotalDataByCategory.map((item) => item.total_orders.category_name),
                  datasets: [
                    {
                      label: `Total Order Tahun ${selectedYear || ""}`,
                      data: filteredTotalDataByCategory.map((item) => item.total_orders.total_orders ?? 0),
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
                  labels: filteredNominalDataByCategory.map((item) => item.total_nominal.category_name),
                  datasets: [
                    {
                      label: `Total Order Tahun ${selectedYear || ""}`,
                      data: filteredNominalDataByCategory.map((item) => item.total_nominal.total_nominal ?? 0),
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
                  labels: filteredData.map((item) => item.total.bulan),
                  datasets: [
                    {
                      label: `Jumlah Transaksi Tahun ${selectedYear || ""}`,
                      data: filteredData.map((item) => item.total.total),
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
                  labels: filteredNominalData.map((item) => item.total.bulan),
                  datasets: [
                    {
                      label: `Nominal Transaksi Tahun ${selectedYear || ""}`,
                      data: filteredNominalData.map((item) => item.total.total),
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
