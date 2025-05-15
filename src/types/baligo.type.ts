export interface baligoType {
  user_count: number;
  user: UserType[];
  kurir_count: number;
  kurir: KurirType[];
  kendaraan_count: number;
  pengiriman_count: PengirimanItem[];
  pengiriman_selesai_count: PengirimanSelesai[];
  revenue: revenue[];
  detail: detail[];
  date: string;
}

export interface UserType {
  id: number;
  nama: string;
  email: string;
  no_telp: string;
  alamat: string;
  kota: string;
  created_at: string;
}

export interface KurirType {
  id: number;
  nama: string;
  date_joined: string;
  no_telp: string;
  email: string;
  status: string;
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