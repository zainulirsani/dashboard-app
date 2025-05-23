// arproval.type.ts

export interface TotalHarga {
  date_arproval: string;
  total_harga: string;
}

export interface TotalNego {
  date_arproval: string;
  total_nego: string;
}

export interface TotalApproved {
  date_arproval: string;
  total_harga: string;
  total_nego: string;
}

export interface TotalBelum {
  date_arproval: string;
  total_harga: string;
  total_nego: string;
}
export interface TotalPending {
  date_arproval: string;
  total_harga: string;
  total_nego: string;
}
export interface TotalDitolak {
  date_arproval: string;
  total_harga: string;
  total_nego: string;
}

export interface ArprovalItem {
  id: number;
  no_sq: string;
  total_harga: number;
  holding: string;
  date_arproval: string;
  keterangan_sq: string;
  keterangan: string;
  status: string;
}

export interface ArprovalData {
  approved: number;
  belum_diapprove: number;
  pending: number;
  ditolak: number;
  total_harga: TotalHarga[];
  total_nego: TotalNego[];
  total_approved: TotalApproved[];
  total_pending: TotalPending[];
  total_belum: TotalBelum[];
  total_ditolak: TotalDitolak[];
  all: ArprovalItem[];
}
