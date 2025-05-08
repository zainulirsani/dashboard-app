import UserView from "@/views/Admin/Users";
import { PerusahaanType } from "@/types/Perusahaan.type";
import { UserType } from "@/types/User.type";

interface UsersPageProps {
    users: UserType[];
    devisis: PerusahaanType[];
}

const UsersPage = ({ users, devisis }: UsersPageProps) => {
    return <UserView users={users} devisis={devisis} />;
};

export default UsersPage;

export async function getServerSideProps() {
    try {
        const [usersRes, devisisRes] = await Promise.all([
            fetch('http://127.0.0.1:8000/api/users', {
                headers: { Accept: "application/json" },
            }),
            fetch('http://127.0.0.1:8000/api/perusahaan', {
                headers: { Accept: "application/json" },
            })
        ]);

        if (!usersRes.ok || !devisisRes.ok) {
            throw new Error("Failed to fetch data from API");
        }

        const users: UserType[] = await usersRes.json();
        const devisis: PerusahaanType[] = await devisisRes.json();

        return {
            props: {
                users: Array.isArray(users) ? users : [],
                devisis: Array.isArray(devisis) ? devisis : [],
            }
        };
    } catch (error) {
        console.error("Error fetching data:", error);
        return {
            props: {
                users: [],
                devisis: []
            }
        };
    }
}
