import { ArproType } from "@/types/arpro.type";
import ArproView from "@/views/DetailPerusahaan/Arpro";

interface ArproPageProps {
  arpro: ArproType;
}

const ArproPage = ({ arpro }: ArproPageProps) => {
  return <ArproView data={arpro} />;
};

export default ArproPage;

export async function getStaticProps() {
  const res = await fetch('http://127.0.0.1:8002/api/presale');
  const response = await res.json();

  return {
      props: {
      arpro: response
      },
      revalidate: 500,
  };
}

