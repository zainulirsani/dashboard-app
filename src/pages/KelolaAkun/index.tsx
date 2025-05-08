import { UserType } from "@/types/User.type";
import AkunViews from "@/views/KelolaAkun";
import { GetServerSidePropsContext } from "next";
import nookies from "nookies";

const kelolaAkunPage = (props: { users: UserType }) => {
    const { users } = props;
    return (
        <div>
            <AkunViews data={users} />
        </div>
    )
}

export default kelolaAkunPage;

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

    // Ambil data user dari token
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

    // (Opsional) Ambil data detail user berdasarkan ID jika dibutuhkan
    const userDetailRes = await fetch(`http://127.0.0.1:8000/api/users/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!userDetailRes.ok) {
        return {
            props: {
                users: userData.result, // fallback jika detail gagal
            },
        };
    }

    const userDetail = await userDetailRes.json();

    return {
        props: {
            users: userDetail.result,
            role: userRole,
        },
    };
}