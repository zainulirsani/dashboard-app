export type ApprovalType = {
    approved: number;
    ditolak: number;
    pending: number;
    belum_diapprove: number;
    total_harga: number;
    total_nego: number;
    total_approved: number;
    nego_approved: number;
    total_belum: number;
    nego_belum: number;
    total_ditolak: number;
    nego_ditolak: number;
    date_approval: string;
    no_sq: string;
    holding: string;
    keterangan_sq: string;
    keterangan: string;
    status: string;
    all: DataAllType[];
};

export type DataAllType = {
    no_sq: string;
    holding: string;
    keterangan_sq: string;
    keterangan: string;
    status: string;
};