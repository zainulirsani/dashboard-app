import styles from "./users.module.scss";
import { useEffect, useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { UserType } from '@/types/User.type';
import Users from "@/components/elements/Form/Users";
import Swal from "sweetalert2";
import { PerusahaanType } from "@/types/Perusahaan.type";
import router from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

const UserView = ({ users, devisis }: { users: UserType[], devisis: PerusahaanType[] }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/user/delete/${id}`, {
            method: "DELETE",
          });

          if (response.ok) {
            Swal.fire("Terhapus!", "Data telah berhasil dihapus.", "success");
            router.reload();
          } else {
            Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus data.", "error");
          }
        } catch (error) {
          Swal.fire("Gagal!", "Terjadi kesalahan pada jaringan.", "error");
        }
      }
    });
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, formData: any) => {
    event.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    const isUpdate = !!selectedUser;
    const apiUrl = isUpdate
      ? `http://127.0.0.1:8000/api/user/update/${selectedUser.id}`
      : "http://127.0.0.1:8000/api/user/create";

    if (isUpdate) {
      formDataToSend.append("_method", "PUT");
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formDataToSend,
      });

      const responseData = await response.json();

      if (response.ok) {
        Swal.fire({
          title: "Berhasil!",
          text: isUpdate ? "Data berhasil diperbarui." : "Data berhasil disimpan.",
          icon: "success",
        }).then(() => {
          window.location.reload();
        });
        handleCloseModal();
      } else {
        Swal.fire({
          title: "Gagal!",
          text: responseData.message || "Terjadi kesalahan saat menyimpan data.",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire("Gagal!", "Terjadi kesalahan pada jaringan.", "error");
    }
  };

  const handleOpenModal = (user: UserType | null = null) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  const columns = useMemo<ColumnDef<UserType>[]>(
    () => [
      {
        header: "NO",
        cell: ({ row }) => row.index + 1,
      },
      {
        header: "Nama",
        accessorKey: "name",
      },
      {
        header: "Email",
        accessorKey: "email",
      },
      {
        header: "Role",
        accessorKey: "role",
      },
      {
        header: "Aksi",
        cell: ({ row }) => (
          <div>
            <button
              className="btn btn-primary btn-sm me-2"
              onClick={() => handleOpenModal(row.original)}
            >
              <FontAwesomeIcon icon={faPen} className="me-1" /> Edit
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDelete(row.original.id)}
            >
              <i className="fas fa-trash-alt me-2"></i> Hapus
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredUsers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section className="p-3">
      <div className="row align-items-end">
        <header className={`${styles.header} d-flex align-items-center justify-content-between`}>
          <h3 className={`${styles.header__h3} text-center flex-grow-1`}>Daftar User</h3>
          <button className="btn btn-success btn-sm" onClick={() => handleOpenModal()}>
            <i className="fas fa-plus me-1"></i> Tambah User
          </button>
        </header>

        {showModal && (
          <Users
            showModal={true}
            selectedUser={selectedUser}
            handleCloseModal={handleCloseModal}
            handleSubmit={handleSubmit}
            devisis={devisis}
          />
        )}

        <div className="card mt-3">
          <div className="card-body">
            <input
              type="text"
              className="form-control mb-3 col-md-4"
              placeholder="Cari nama user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="overflow-x-auto rounded-xl shadow"></div>
            <table className="table table-bordered table-striped table-hover">
              <thead className="thead-light">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="text-center text-muted">
                      Tidak ada data pengguna.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

          </div>
        </div>
      </div>

    </section >
  );
};

export default UserView;
