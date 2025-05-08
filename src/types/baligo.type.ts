

  export interface baligoType {
      user_count: number;
      kurir_count: number;
      kendaraan_count: number;
      pengiriman_count: PengirimanItem[];
      pengiriman_selesai_count: PengirimanSelesai[];
      revenue: revenue[];
      date: string;
  }
  export interface PengirimanItem {
    date: string;
    count: number;
}
export interface PengirimanSelesai{
    date: string;
    count: number;
}
export interface revenue{
    date: string;
    count: number;
}