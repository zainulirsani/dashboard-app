import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

// Types
type LoginUserProps = {
  email: string;
  password: string;
};

type LoginResponse = {
  meta: {
    code: number;
    status: string;
    message: string;
  };
  result: {
    access_token: string;
    token_type: string;
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
      email_verified_at: string | null;
      created_at: string;
      updated_at: string;
    };
  };
};

// Constants
const API_URL = "http://127.0.0.1:8000/api/login";
const HEADERS = {
  "Content-Type": "application/json",
};

const LoginViews: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
  
    try {
      const response = await loginUser({ email, password });
      const data: LoginResponse = await response.json();
  
      if (response.ok && data.meta.code === 200) {
        // Simpan token ke cookies
        Cookies.set("access_token", data.result.access_token, { expires: 7 });
  
        // Ambil role user
        const userRole = data.result.user.role.toLowerCase();
  
        // Tentukan tujuan redirect berdasarkan role
        let redirectPath = "/dashboard"; // Default jika role tidak dikenali
        if (userRole === "manager") {
          redirectPath = "/manager";
        } else if (userRole === "admin") {
          redirectPath = "/admin";
        } else if (userRole === "kadiv") {
          redirectPath = "/kadiv";
        }
  
        // Tampilkan pesan sukses
        Swal.fire({
          icon: "success",
          title: "Login Berhasil",
          text: "Anda akan dialihkan ke dashboard.",
          timer: 2000,
          showConfirmButton: false,
        });
  
        // Redirect ke halaman sesuai role
        setTimeout(() => {
          router.push(redirectPath);
        }, 2000);
      } else {
        // Menampilkan alert error dengan SweetAlert2
        const errorMessage = data.meta.message || "Login gagal, periksa kembali kredensial Anda.";
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errorMessage,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
  
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: error instanceof Error ? error.message : "Terjadi kesalahan.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  

  const loginUser = async ({ email, password }: LoginUserProps): Promise<Response> => {
    try {
      return await fetch(API_URL, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ email, password }),
      });
    } catch (error) {
      console.error('Error contacting the API:', error);
      throw error;
    }
  };

  return (
    <section className="vh-100" style={{ backgroundColor: "#ffffff" }}>
      <div className="container h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card" style={{ borderRadius: "1rem" }}>
              <div className="row g-0">
                <div className="col-md-6 col-lg-5 d-none d-md-block">
                  <Image
                    src="/images/login.svg"
                    alt="form login"
                    width={500}
                    height={500}
                    className="img-fluid mt-5"
                    style={{ borderRadius: "1rem 0 0 1rem" }}
                  />
                </div>
                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5 text-black">
                    <form onSubmit={handleLogin}>
                      <div className="d-flex align-items-center mb-3 pb-1">
                        <Image src="/images/images.png" alt="Logo" width={150} height={50} />
                      </div>
                      <header>
                        <h3 className="mt-3" style={{ letterSpacing: "1px" }}>
                          Masuk ke akun Anda
                        </h3>
                      </header>
                      <div className="form-outline mb-4">
                        <div className="mb-3">
                          <label htmlFor="editUsername" className="form-label">
                            Email
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            id="editUsername"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="mb-3 position-relative">
                          <label htmlFor="editPassword" className="form-label">
                            Kata Sandi
                          </label>
                          <div className="input-group">
                            <input
                              type={showPassword ? "text" : "password"}
                              className="form-control"
                              id="editPassword"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                            />
                            <button
                              type="button"
                              className="btn btn-outline-secondary toggle-password"
                              onClick={togglePasswordVisibility}
                            >
                              <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} id="passwordIcon"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="pt-1 mb-4">
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg btn-block"
                          disabled={loading}
                        >
                          {loading ? "Memproses..." : "Login"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginViews;
