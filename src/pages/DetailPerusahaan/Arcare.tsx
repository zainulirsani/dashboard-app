import { ArcareDataType } from "@/types/arcare.type";
import ArcareView from "@/views/DetailPerusahaan/Arcare";

const ArcarePage = ({ arcare }: { arcare: ArcareDataType }) => {
  return <ArcareView data={arcare} />;
};

export default ArcarePage;

export async function getStaticProps() {
  const res = await fetch("http://127.0.0.1:8003/api/arcare");
  const response = await res.json();

  return {
    props: {
      arcare: response.data, // response.data harus bentuk ArcareDataType
    },
    revalidate: 500,
  };
}
