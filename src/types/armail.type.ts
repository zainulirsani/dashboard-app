export interface ArmailType {
  meta: {
    code: number;
    status: string;
    message: string | null;
  };
  result: {
    CSR: number;
    KerjaPraktik: number;
    KerjaSama: number;
    Narasumber: number;
    Presentasi: number;
    Meeting: number;
    Undangan: number;
    Knowledge: number;
    Tugas: number;
    Lamaran: number;
    Penelitian: number;

    Surat: SuratType[];

    jumlah: TahunJumlahType[]; // ✅ Ganti dari object jadi array sesuai API response
  };
}
export interface TahunJumlahType {
  tahun: number;
  data: BulanDataType[];
}

export interface BulanDataType {
  bulan: string;
  CSR?: number;
  KerjaPraktik?: number;
  KerjaSama?: number;
  Narasumber?: number;
  Presentasi?: number;
  Meeting?: number;
  Undangan?: number;
  Knowledge?: number;
  Tugas?: number;
  Lamaran?: number;
  Penelitian?: number;
}
export type SuratType = {
  jenis_surat: string;
  tanggal_awal: string;
  tanggal_akhir: string;
  perihal?: string;
  keterangan?: string;
};
export type JenisSurat =
  | "CSR"
  | "KerjaPraktik"
  | "KerjaSama"
  | "Narasumber"
  | "Presentasi"
  | "Meeting"
  | "Undangan"
  | "Knowledge"
  | "Tugas"
  | "Lamaran"
  | "Penelitian";
