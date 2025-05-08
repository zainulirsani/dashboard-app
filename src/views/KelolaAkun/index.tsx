import { useState } from 'react';
import styles from './akun.module.scss';
import Image from 'next/image';
import AkunFormModal from '@/components/elements/Form/Akun';

type UserData = {
  id: number;
  name: string;
  email: string;
};

const AkunViews = ({ data }: { data: UserData }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: data.name || '',
    email: data.email || '',
    password: '',
    profilePic: null as File | null,
  });

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, files } = e.target;

    if (id === 'editProfile' && files?.length) {
      setFormData((prev) => ({ ...prev, profilePic: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (data: typeof formData) => {
    const submissionData = new FormData();
    submissionData.append('name', data.name);
    submissionData.append('email', data.email);
    submissionData.append('password', data.password);
    if (data.profilePic) {
      submissionData.append('profilePic', data.profilePic);
    }

    try {
      console.log('Data yang dikirim ke API:');
      submissionData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });

      const response = await fetch(
        `http://127.0.0.1:8000/api/user/updateAkun/${dataUserId}`,
        {
          method: 'POST',
          body: submissionData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log('Success:', result);
        // tampilkan notifikasi jika perlu
      } else {
        console.error('Error:', result);
      }

      setShowModal(false);
    } catch (error) {
      console.error('Network Error:', error);
    }
  };

  const dataUserId = data.id;
  const defaultValue = formData;

  return (
    <section className={`p-4 ${styles.akunContainer}`}>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className={`card shadow-sm ${styles.cardCustom}`}>
            <div className="card-body">
              <div className="text-center mb-4">
                <Image
                  src="/images/avatar.jpg"
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
              defaultValue={defaultValue}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default AkunViews;
