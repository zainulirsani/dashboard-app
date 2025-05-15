// Tipe untuk item tanggal + total (totalTiket, menunggu, proses, pending, batal, selesai)
export interface TotalPerTanggal  {
  tanggal: string; 
  total: number;
};

// Tipe untuk data tiket
export interface Ticket  {
  tanggal: string;
  nama_satker: string;
  nama_pic_ruangan: string;
  status: string;
};

// Tipe untuk data teknisi dalam assigment
export interface TeknisiAssignment  {
  nama_teknisi: string;
  status: string;
};

// Tipe untuk setiap tanggal dalam assigment
export interface AssigmentPerTanggal  {
  tanggal: string;
  data: TeknisiAssignment[];
};

// Tipe utama untuk response
export interface ArcareType  {
    totalTiket: TotalPerTanggal[];
    menunggu: TotalPerTanggal[];
    proses: TotalPerTanggal[];
    pending: TotalPerTanggal[];
    batal: TotalPerTanggal[];
    selesai: TotalPerTanggal[];
    ticket: Ticket[];
    assigment: AssigmentPerTanggal[];
};
