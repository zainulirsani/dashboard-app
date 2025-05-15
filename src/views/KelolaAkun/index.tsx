import { useState } from 'react';
import styles from './akun.module.scss';
import Image from 'next/image';
import AkunFormModal from '@/components/elements/Form/Akun';

type UserData = {
  id: number;
  name: string;
  email: string;
  profilePic: string;
};

const AkunViews = ({ data }: { data: UserData }) => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const dataUserId = data.id;

  const handleSubmit = async (data: {
    name: string;
    email: string;
    password: string;
    profilePic: File | null;
  }) => {
    const submissionData = new FormData();
  
    submissionData.append('name', data.name);
    submissionData.append('email', data.email);
    submissionData.append('password', data.password);
    if (data.profilePic) {
      submissionData.append('profilePic', data.profilePic);
    }
  
    // Tambahkan method spoofing karena Laravel hanya menerima PUT via POST + _method
    submissionData.append('_method', 'PUT');
  
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/user/updateAkun/${dataUserId}`,
        {
          method: 'POST', // HARUS POST untuk FormData + Laravel spoofing
          body: submissionData,
        }
      );
  
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      const result = isJson ? await response.json() : await response.text();
  
      if (response.ok) {
        console.log('✅ Berhasil update:', result);
      } else {
        console.error('❌ Gagal update:', result);
      }
  
      setShowModal(false);
    } catch (error) {
      console.error('⚠️ Network Error:', error);
    }
  };
  

  return (
    <section className={`p-4 ${styles.akunContainer}`}>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className={`card shadow-sm ${styles.cardCustom}`}>
            <div className="card-body">
              <div className="text-center mb-4">
                <Image
                  src={`http://127.0.0.1:8000/users/${data.profilePic}`}
                  width={120}
                  height={120}
                  className={`${styles.profilePic} rounded-circle`}
                  alt="Foto Profil"
                />
              </div>
              <ul className="list-group list-group-flush">
                <li className={`list-group-item ${styles.listItem}`}>
                  <strong>Nama</strong> <span>: {data.name}</span>
                </li>
                <li className={`list-group-item ${styles.listItem}`}>
                  <strong>Email</strong> <span>: {data.email}</span>
                </li>
                <li className={`list-group-item ${styles.listItem}`}>
                  <strong>Password</strong> <span>: ********</span>
                </li>
              </ul>

              <div className="d-grid mt-4">
                <button
                  className={`btn btn-primary ${styles.btnCustom}`}
                  onClick={handleOpenModal}
                >
                  Edit Akun
                </button>
              </div>
            </div>
          </div>

          {showModal && (
            <AkunFormModal
              showModal={showModal}
              handleCloseModal={handleCloseModal}
              handleSubmit={handleSubmit}
              defaultValue={{
                name: data.name || '',
                email: data.email || '',
                password: '',
                profilePic: null,
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
};


export default AkunViews;
