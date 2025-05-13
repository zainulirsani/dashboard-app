export interface baligoType {
  user_count: number;
  kurir_count: number;
  kendaraan_count: number;
  pengiriman_count: PengirimanItem[];
  pengiriman_selesai_count: PengirimanSelesai[];
  revenue: revenue[];
  detail: detail[];
  date: string;
}
export interface PengirimanItem {
  date: string;
  count: number;
}
export interface PengirimanSelesai {
  date: string;
  count: number;
}
export interface revenue {
  date: string;
  total_tarif: number;
}
export interface detail{
  id: number;
  nama_pengirim: string;
  nama_penerima: string;
  detail_barang: string;
  total_tarif: number;
  created_at: string;
  kota: string;
}