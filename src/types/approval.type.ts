// approval.type.ts

export interface TotalHarga {
  date_approval: string;
  total_harga: string;
}

export interface TotalNego {
  date_approval: string;
  total_nego: string;
}

export interface TotalApproved {
  date_approval: string;
  total_harga: string;
  total_nego: string;
}

export interface TotalBelum {
  date_approval: string;
  total_harga: string;
  total_nego: string;
}

export interface TotalDitolak {
  date_approval: string;
  total_harga: string;
  total_nego: string;
}

export interface ApprovalItem {
  id: number;
  no_sq: string;
  total_harga: number;
  holding: string;
  date_approval: string;
  keterangan_sq: string;
  keterangan: string;
  status: string;
}

export interface ApprovalData {
  approved: number;
  belum_diapprove: number;
  pending: number;
  ditolak: number;
  total_harga: TotalHarga[];
  total_nego: TotalNego[];
  total_approved: TotalApproved[];
  total_belum: TotalBelum[];
  total_ditolak: TotalDitolak[];
  all: ApprovalItem[];
}
