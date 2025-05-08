import { roleRoutes } from "@/config/roleRoutes";

// Fungsi akses umum (untuk role selain kadiv)
export function hasStaticAccess(role: string, path: string): boolean {
    const routes = roleRoutes[role] || [];
    return routes.some(route => path.startsWith(route));
}

// Fungsi akses khusus manager
export function hasManagerAccess(role: string, path: string): boolean {
    if (role !== "manager") return false;
    return path.startsWith("/DetailPerusahaan");
}

// Fungsi akses khusus kadiv berdasarkan slug perusahaan
export async function hasKadivAccess(userId: number, path: string): Promise<boolean> {
    const res = await fetch(`http://127.0.0.1:8000/api/hak-akses/${userId}`);
    const data = await res.json();

    if (!data || !data.result || !Array.isArray(data.result.perusahaan_diakses)) return false;

    const allowedSlugs = data.result.perusahaan_diakses.map((p: any) => p.slug_perusahaan.toLowerCase());

    // Match URL seperti /DetailPerusahaan/BaliMall
    const match = path.match(/^\/DetailPerusahaan\/([^\/]+)/i);
    const slugInPath = match?.[1]?.toLowerCase();

    if (!slugInPath) return false;

    return allowedSlugs.includes(slugInPath);
}

// Fungsi utama pengecekan akses
export async function checkPageAccess(role: string, path: string, userId?: number): Promise<boolean> {
    if (role === "manager") {
        return hasStaticAccess(role, path) || hasManagerAccess(role, path);
    } else if (role === "kadiv" && userId) {
        if (path.startsWith("/DetailPerusahaan")) {
          return await hasKadivAccess(userId, path);
        } else {
          return hasStaticAccess(role, path);
        }
      } else {
        return hasStaticAccess(role, path);
    }
}
