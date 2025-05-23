import ArprovalView from "@/views/DetailPerusahaan/Arproval";
import { ArprovalData } from "@/types/arproval.type";


const ArprovalPage = (props: { arprovals: ArprovalData }) => {
    const { arprovals } = props;
    return (
        <ArprovalView data={arprovals} />
    );
};

export default ArprovalPage;

export async function getStaticProps() {
    const res = await fetch('http://127.0.0.1:8001/api/arproval');
    const response = await res.json();

    return {
        props: {
            arprovals: response.data,
        },
        revalidate: 500,
    };
}