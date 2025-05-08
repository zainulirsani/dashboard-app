export interface ArcareType {
    tanggal_dibuat: string;
    nama_satker: string;
    total_tiket: number;
    dikerjakan: number;
    selesai: number;
    pending: number;
    dibatalkan: number;
    total_nominal: number;
  }
  
  export interface ArcareDataType {
    totalTiket: number;
    menunggu: number;
    proses: number;
    pending: number;
    selesai: number;
    batal?: number;
    tiket: ArcareType[];
  }
  