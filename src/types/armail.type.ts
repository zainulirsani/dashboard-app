export interface ArmailType {
  meta: {
    code: number;
    status: string;
    message: string | null;
  };
  result: {
    CSR: CSRType[];
    KerjaPraktik: KerjaPraktikType[];
    KerjaSama: KerjaSamaType[];
    Narasumber: NarasumberType[];
    Presentasi: PresentasiType[];
    Meeting: MeetingType[];
    Undangan: UndanganType[];
    Knowledge: KnowledgeType[];
    Tugas: TugasType[];
    Lamaran: LamaranType[];
    Penelitian: PenelitianType[];

    Surat: SuratType[];

    jumlah: TahunJumlahType[]; // ✅ Ganti dari object jadi array sesuai API response
  };
}

export interface CSRType{
  total: number;
  tanggal: string;
}
export interface KerjaPraktikType{
  total: number;
  tanggal: string;
}
export interface KerjaSamaType{
  total: number;
  tanggal: string;
}
export interface NarasumberType{
  total: number;
  tanggal: string;
}
export interface PresentasiType{
  total: number;
  tanggal: string;
}
export interface MeetingType{
  total: number;
  tanggal: string;
}
export interface UndanganType{
  total: number;
  tanggal: string;
}
export interface KnowledgeType{
  total: number;
  tanggal: string;
}
export interface TugasType{
  total: number;
  tanggal: string;
}
export interface LamaranType{
  total: number;
  tanggal: string;
}
export interface PenelitianType{
  total: number;
  tanggal: string;
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
type Agenda = {
  tanggal_awal: string;
  waktu_mulai: string;
  waktu_selesai: string;
  acara: string;
  nama_pengguna: string;
};


// Pastikan SuratType memiliki semua properti yang sama dengan Surat
type SuratType = {
  id: number;
  perihal: string;
  nomor_surat: string;
  jenis_surat: string;
  tanggal_awal: string;
  tanggal_akhir: string;
  keterangan: string;
  penugasan: { id: number; agenda: Agenda[] }[]; // Perhatikan penugasan di sini
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
