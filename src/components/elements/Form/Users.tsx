import { useState, useEffect, useCallback } from "react";

interface UserFormData {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
    devisi?: string | number[];
  }
  
  interface UserFormModalProps {
    showModal: boolean;
    handleCloseModal: () => void;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>, formData: UserFormData) => void;
    selectedUser: UserFormData | null;
    devisis: { id: number; nama_perusahaan: string }[];
  }
  
const UserFormModal = ({ showModal, handleCloseModal, handleSubmit, selectedUser, devisis }: UserFormModalProps) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
        devisi: [] as number[],
    });

    useEffect(() => {
        if (showModal) {
            setFormData({
                name: selectedUser?.name || "",
                email: selectedUser?.email || "",
                password: "",
                role: selectedUser?.role || "",
                devisi: selectedUser?.devisi
                    ? (Array.isArray(selectedUser.devisi)
                        ? selectedUser.devisi.map(Number)
                        : selectedUser.devisi.toString().split(",").map(id => isNaN(Number(id)) ? 0 : Number(id)))
                    : [],

            });
        }
    }, [showModal, selectedUser]);

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, devisiId: number) => {
        setFormData((prev) => ({
            ...prev,
            devisi: event.target.checked
                ? [...prev.devisi, devisiId] // Tambahkan ID jika dicentang
                : prev.devisi.filter((id) => id !== devisiId), // Hapus ID jika tidak dicentang
        }));
    };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleSubmit(event, { ...formData, devisi: formData.devisi }); // Pastikan devisi dikirim sebagai array
    };

    return (
        <div className={`modal fade ${showModal ? "show d-block" : "d-none"}`} tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-md" role="document">
                <div className="modal-content">
                    {/* Modal Header */}
                    <div className={`modal-header ${selectedUser ? "bg-primary" : "bg-success"} text-white`}>
                        <h5 className="modal-title fw-bold">
                            {selectedUser ? "Edit User" : "Tambah User"}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={handleCloseModal}></button>
                    </div>

                    {/* Modal Body */}
                    <div className="modal-body">
                        <form id="formUser" onSubmit={handleFormSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Nama</label>
                                <input
                                    type="text"
                                    className="form-control border-primary"
                                    name="name"
                                    onChange={handleChange}
                                    value={formData.name}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Email</label>
                                <input
                                    type="email"
                                    className="form-control border-primary"
                                    name="email"
                                    onChange={handleChange}
                                    value={formData.email}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Password</label>
                                <input
                                    type="password"
                                    className="form-control border-primary"
                                    name="password"
                                    onChange={handleChange}
                                    value={formData.password}
                                    required={!selectedUser || formData.password !== ""}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Role</label>
                                <select
                                    className="form-select border-primary"
                                    name="role"
                                    onChange={handleChange}
                                    value={formData.role}
                                    required
                                >
                                    <option value="" disabled>Pilih Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="manager">Manager</option>
                                    <option value="kadiv">Kepala Devisi</option>
                                </select>
                            </div>

                            {/* Devisi hanya muncul jika role adalah "kadiv" */}
                            {formData.role === 'kadiv' && (
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Daftar Perusahaan</label>
                                    <div className="form-check-container">
                                        {devisis.map((devisi) => (
                                            <div key={devisi.id} className="form-check d-flex align-items-center justify-content-between border-bottom py-2">
                                                <label className="form-check-label mb-0 fw-normal text-muted flex-grow-1">
                                                    {devisi.nama_perusahaan}
                                                </label>
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input ms-2"
                                                    value={devisi.id}
                                                    onChange={(event) => handleCheckboxChange(event, devisi.id)}
                                                    checked={formData.devisi.includes(devisi.id)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Modal Footer */}
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Batal
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserFormModal;
