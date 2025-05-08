import BaligoView from "@/views/DetailPerusahaan/Baligo";
import { baligoType } from "@/types/baligo.type";

const BaligoPage = ({baligo}: {baligo: baligoType}) => {
    return (
        <>
            <BaligoView data={baligo} />
        </>
    )
};

export async function getStaticProps() {
    const res = await fetch('http://127.0.0.1:8006/api/baligo');
    const response = await res.json();
    return {
        props: {
            baligo: response.result
        },
        revalidate: 500
    };
}

export default BaligoPage;