import React, { useState, useEffect, ChangeEvent } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/lib/cropImage'; // utility untuk crop image hasil canvas
import { Modal, Button } from 'react-bootstrap';
import Image from 'next/image';

type AkunFormModalProps = {
    showModal: boolean;
    handleCloseModal: () => void;
    handleSubmit: (formData: {
      name: string;
      email: string;
      password: string;
      profilePic: File | null;
    }) => void;
    defaultValue: {
      name: string;
      email: string;
      password: string;
      profilePic: File | null;
    };
  };
  

const AkunFormModal: React.FC<AkunFormModalProps> = ({
    showModal,
    handleCloseModal,
    handleSubmit,
    defaultValue,
}) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        profilePic: null as File | null,
    });

    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [cropping, setCropping] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        if (defaultValue) {
            setFormData((prev) => ({
                ...prev,
                name: defaultValue.name,
                email: defaultValue.email,
            }));
        }
    }, [defaultValue]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result as string);
                setCropping(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const showCroppedImage = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
        const croppedUrl = URL.createObjectURL(croppedBlob);
        const croppedFile = new File([croppedBlob], 'cropped_image.jpg', { type: 'image/jpeg' });

        setPreviewImage(croppedUrl);
        setFormData((prev) => ({ ...prev, profilePic: croppedFile }));
        setCropping(false);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit(formData); // Kirim ke API di parent component
        // Jika perlu mengirim _method: PUT, bisa dilakukan di parent handleSubmit
    };

    return (
        <Modal show={showModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit Akun</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleFormSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label fw-semibold">Nama</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Masukkan nama lengkap"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label fw-semibold">Email</label>
                        <input
                            type="text"
                            className="form-control"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Masukkan email"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="profilePic" className="form-label fw-semibold">Foto Profil</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="form-control"
                            onChange={handleImageChange}
                        />
                        {previewImage && (
                            <div className="mt-3">
                                <Image
                                    src={previewImage}
                                    alt="Preview"
                                    className="img-thumbnail rounded-circle"
                                    style={{ maxWidth: '150px' }}
                                />
                            </div>
                        )}
                    </div>

                    {cropping && imageSrc && (
                        <>
                            <div className="crop-container mb-3" style={{ position: 'relative', width: '100%', height: 200 }}>
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={onCropComplete}
                                />
                            </div>
                            <div className="d-grid mb-3">
                                <Button variant="success" onClick={showCroppedImage}>
                                    Selesai Crop
                                </Button>
                            </div>
                        </>
                    )}

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label fw-semibold">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Masukkan password baru"
                        />
                    </div>

                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">Simpan Perubahan</button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default AkunFormModal;
