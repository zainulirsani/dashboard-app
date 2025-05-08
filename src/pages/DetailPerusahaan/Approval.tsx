import ApprovalView from "@/views/DetailPerusahaan/Approval";
import { ApprovalType } from "@/types/approval.type";


const ApprovalPage = (props: { approvals: [ApprovalType] }) => {
    const { approvals } = props;
    return (
        <ApprovalView data={approvals} />
    );
};

export default ApprovalPage;
// export async function getServerSideProps() {
//     const res = await fetch('http://127.0.0.1:8001/api/approval');
//     const response = await res.json();
  
//     return {
//       props: {
//         approvals: response.data,
//       },
//     };
//   }
  
export async function getStaticProps() {
    const res = await fetch('http://127.0.0.1:8001/api/approval');
    const response = await res.json();

    return {
        props: {
            approvals: response.data,
        },
        revalidate: 500,
    };
}