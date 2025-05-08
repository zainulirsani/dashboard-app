import { checkPageAccess } from "@/lib/checkPageAccess";
import { PerusahaanType } from "@/types/Perusahaan.type";
import Dashboard from "@/views/Manager/Dashboard";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import nookies from "nookies";
import { useEffect } from "react";
type Props = {
    perusahaans?: PerusahaanType[] | null;
    hasAccess: boolean;
    userRole: string;
};

const DashboardManager = ({ hasAccess, userRole, perusahaans }: Props) => {
    const router = useRouter();

    useEffect(() => {
        if (!hasAccess) {
            router.replace(`/${userRole}`);
        }
    }, [hasAccess, userRole, router]);

    if (!hasAccess || !perusahaans) {
        return null; // kosongkan tampilan saat proses redirect
    }
    return (
        <div>
            <Dashboard perusahaans={perusahaans} />
        </div>
    );
};

export default DashboardManager;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const cookies = nookies.get(ctx);
    const token = cookies.access_token;

    if (!token) {
        return {
            redirect: {
                destination: "/auth/login",
                permanent: false,
            },
        };
    }

    // Fetch user
    const userRes = await fetch("http://127.0.0.1:8000/api/user", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!userRes.ok) {
        return {
            redirect: {
                destination: "/auth/login",
                permanent: false,
            },
        };
    }

    const userData = await userRes.json();
    const userRole = userData.result.role.toLowerCase();
    const userId = userData.result.id;

    const currentPath = ctx.resolvedUrl;

    const hasAccess = await checkPageAccess(userRole, currentPath, userId);

    if (!hasAccess) {
        return {
            props: {
                hasAccess: false,
                userRole,
                perusahaans: null,
            },
        };
    }

    const res = await fetch("http://127.0.0.1:8000/api/perusahaan", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const response = await res.json();

    return {
        props: {
            hasAccess: true,
            userRole,
            perusahaans: response,
        },
    };
}
