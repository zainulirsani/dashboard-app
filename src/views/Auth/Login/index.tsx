import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import styles from "./login.module.scss"

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
          title: "Login Successful",
          text: "You will be redirected to the dashboard.",
          timer: 2000,
          showConfirmButton: false,
        });

        // Redirect ke halaman sesuai role
        setTimeout(() => {
          router.push(redirectPath);
        }, 2000);
      } else {
        // Menampilkan alert error dengan SweetAlert2
        const errorMessage = data.meta.message || "Login failed, please check your credentials.";
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
        title: "Login Failed",
        text: error instanceof Error ? error.message : "An error occurred.",
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
    <section className={`${styles.loginSection}`}>
      <div className="container h-100">
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-xl-10">
            <div className={`${styles.cardModern}`}>
              <div className="row g-0">
                <div className="col-md-6 d-none d-md-block">
                  <Image
                    src="/images/login.svg"
                    alt="form login"
                    width={500}
                    height={500}
                    className={`${styles.image} img-fluid`}
                    priority
                  />
                </div>
                <div className="col-md-6 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5">
                    <form onSubmit={handleLogin}>
                      <div className="text-center mb-4">
                        <Image src="/images/images.png" alt="Logo" width={120} height={40} />
                        <h4 className="mt-3">Sign in to your account</h4>
                      </div>
                      <div className="form-group mb-3">
                        <label>Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label>Password</label>
                        <div className="input-group">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <button type="button" className="btn btn-outline-secondary" onClick={togglePasswordVisibility} >
                            <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                          </button>
                        </div>
                      </div>
                      <div className="d-grid">
                        <button type="submit" className="btn btn-primary d-flex align-items-center gap-2" disabled={loading}>
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                              Processing...
                            </>
                          ) : (
                            "Login"
                          )}
                        </button>

                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div >
        </div >
      </div >
    </section >
  );
};

export default LoginViews;
