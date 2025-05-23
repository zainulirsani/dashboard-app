
interface PerusahaanFormModalProps {
    showModal: boolean;
    handleCloseModal: () => void;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    selectedPerusahaan: {
        nama_perusahaan?: string;
        endpoint_api?: string;
        status?: string;
    } | null;
}

const PerusahaanFormModal = ({
    showModal,
    handleCloseModal,
    handleSubmit,
    selectedPerusahaan,
}: PerusahaanFormModalProps) => {

    return (
        showModal && (
          <div className="modal fade show d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content shadow-lg">
                <div className={`modal-header ${selectedPerusahaan ? "bg-primary text-white" : "bg-success text-white"}`}>
                  <h5 className="modal-title fw-bold">
                    {selectedPerusahaan ? "Edit Company System" : "Add Company System"}
                  </h5>
                  <button type="button" className="btn-close btn-close-white" onClick={handleCloseModal}></button>
                </div>
                <div className="modal-body">
                  <form id="formPerusahaan" onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="mb-3">
                      <label htmlFor="nama_perusahaan" className="form-label fw-semibold">Company System Name</label>
                      <input
                        type="text"
                        className="form-control border-primary"
                        id="nama_perusahaan"
                        name="nama_perusahaan"
                        defaultValue={selectedPerusahaan?.nama_perusahaan || ""}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="endpoint_api" className="form-label fw-semibold">API Endpoint</label>
                      <input
                        type="text"
                        className="form-control border-primary"
                        id="endpoint_api"
                        name="endpoint_api"
                        defaultValue={selectedPerusahaan?.endpoint_api || ""}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="logo" className="form-label fw-semibold">Company System Logo</label>
                      <input
                        type="file"
                        className="form-control border-primary"
                        id="logo"
                        name="logo"
                        accept="image/*"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="status" className="form-label fw-semibold">Status</label>
                      <select
                        className="form-select border-primary"
                        id="status"
                        name="status"
                        defaultValue={selectedPerusahaan?.status || ""}
                      >
                        <option value="" disabled>Select status</option>
                        <option value="aktif">Active</option>
                        <option value="nonaktif">Inactive</option>
                      </select>
                    </div>
                  </form>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-outline-secondary" onClick={handleCloseModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary" form="formPerusahaan">Save</button>
                </div>
              </div>
            </div>
          </div>
        )
      );      
};

export default PerusahaanFormModal;
