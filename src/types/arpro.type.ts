export interface ArproType {
  meta: {
    code: number;
    status: string;
    message: string | null;
  };
  result: {
    total: totalPertanggalType[];
    totalSepakat: totalSepakatType[];
    totalTidakSepakat: tidakSepakatType[];
    totalPenawaran: totalPenawaranType[];
    totalInformasiHarga: totalInformasiHargaType[];
    totalDraft: totalDraftType[];
    presaleByMonth: TahunJumlahType[];
  };
}

export interface totalPertanggalType {
  tanggal: string;
  jumlah_presale: number; 
  nominal: number;
}

export interface totalSepakatType { 
  tanggal: string;
  jumlah_presale: number;
  nominal: number;
}
export interface tidakSepakatType { 
  tanggal: string;
  jumlah_presale: number;
  nominal: number;
}
export interface totalPenawaranType {
  tanggal: string;
  jumlah_presale: number;
  nominal: number;
}

export interface totalInformasiHargaType {
  tanggal: string;
  jumlah_presale: number;
  nominal: number;
}

export interface totalDraftType {
  tanggal: string;
  jumlah_presale: number;
  nominal: number;
}

export interface TahunJumlahType {
  tahun: number;
  data: presaleDataType[];
}

export interface presaleDataType {
  bulan: string;
  "Sepakat": number;
  "Penawaran": number;
  "Informasi Harga": number;
  "Draft": number;
  "Tidak Sepakat": number;
}



export type JenisStatus = 'Sepakat' | 'Penawaran' | 'Informasi Harga' | 'Draft' | 'Tidak Sepakat';
