// 'use client';

// import { Button } from 'primereact/button';
// import 'primereact/resources/themes/lara-light-blue/theme.css';
// import 'primereact/resources/primereact.min.css';
// import 'primeicons/primeicons.css';
// import 'primeflex/primeflex.css';

// export default function EvaluationSetup() {
//   const vendors = [
//     {
//       agency: 'Dentsu',
//       account: 'Digital, France, Health (Digital) - updated question set',
//       questionSet: [
//         'Dig (IAegis) FR/BE/NL | 5 Sections',
//         'Media AG | 4 Sections',
//       ],
//       clientParticipants: ['0: Owners', '3: Assessors'],
//       agencyParticipants: ['0: Owners', '3: Assessors'],
//     },
//     {
//       agency: 'Dentsu',
//       account: 'Digital, France, Hygiene (Digital) - updated question set',
//       questionSet: [
//         'Dig (IAegis) FR/BE/NL | 5 Sections',
//         'Media AG | 4 Sections',
//       ],
//       clientParticipants: ['0: Owners', '2: Assessors'],
//       agencyParticipants: ['0: Owners', '3: Assessors'],
//     },
//   ];

//   return (
//     <div className="p-3">
//       {/* Header Info */}
//       <div className="border-1 border-300 p-4 border-round-xl bg-white card text-sm font-medium flex flex-column md:flex-row gap-4">
//         <div className="flex-1">
//           <div className="text-500">Evaluation Name</div>
//           <div className="text-900 font-semibold">2025-5, H1 Media, Global</div>
//         </div>
//         <div className="flex-1">
//           <div className="text-500">Evaluation Type</div>
//           <div className="text-900 font-semibold">Annual</div>
//         </div>
//         <div className="flex-1">
//           <div className="text-500">Reporting Year</div>
//           <div className="text-900 font-semibold">2025</div>
//         </div>
//         <div className="flex-1">
//           <div className="text-500">Reporting Month</div>
//           <div className="text-900 font-semibold">05</div>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="flex justify-content-end mt-4">
//         <span className="p-input-icon-left w-full md:w-4">
//           <i className="pi pi-search" />
//           <input
//             type="text"
//             className="p-inputtext p-component w-full"
//             placeholder="Search..."
//           />
//         </span>
//       </div>

//       {/* Vendor Cards */}
//       {/* <div className='border-1 border-300 p-4 border-round-xl bg-white shadow-2'> */}
//       <div className="flex flex-column gap-4 mt-4">
//         {vendors.map((vendor, idx) => (
//           <div
//             key={idx}
//             className="bg-white card border-round-xl p-4 border-1 border-300"
//           >
//             <div className="flex justify-content-end">
//               <Button
//                 icon="pi pi-trash"
//                 className="p-button-text p-button-danger p-button-sm"
//               />
//             </div>
//             <div className="font-bold text-lg text-900 mb-3">
//               {vendor.agency}
//             </div>
            
//             <div className="w-full h-1 mb-4 p-2" style={{ backgroundColor: '#F8FAFC' }}>

//             <div className="mb-2 flex">
//               <div className="w-3 text-700 font-semibold">ACCOUNT :</div>
//               <div className="flex-1">{vendor.account}</div>
//             </div>

//             <div className="mb-2 flex">
//               <div className="w-3 text-700 font-semibold">QUESTION SET :</div>
//               <div className="flex-1">
//                 <ul className="list-disc pl-5 m-0">
//                   {vendor.questionSet.map((q, i) => (
//                     <li key={i}>{q}</li>
//                   ))}
//                 </ul>
//               </div>
//             </div>

//             <div className="mb-2 flex">
//               <div className="w-3 text-700 font-semibold">
//                 CLIENT PARTICIPANTS :
//               </div>
//               <div className="flex-1">
//                 {vendor.clientParticipants.join(', ')}
//               </div>
//             </div>

//             <div className="mb-3 flex">
//               <div className="w-3 text-700 font-semibold">
//                 AGENCY PARTICIPANTS :
//               </div>
//               <div className="flex-1">
//                 {vendor.agencyParticipants.join(', ')}
//               </div>
//             </div>

//             <div className="mb-3 flex">
//               <div className="w-3 text-700 font-semibold">SET-UP :</div>
//               <div className="flex-1 flex gap-3 mt-1">
//                 {[1, 2, 3, 4].map((step, i) => (
//                   <div
//                     key={i}
//                     className="flex flex-column align-items-center"
//                   >
//                     <span className="text-xs text-600">{step}</span>
//                     {i % 2 === 0 ? (
//                       <i className="pi pi-check text-white bg-green-600 p-1 border-circle text-sm" />
//                     ) : (
//                       <span className="text-900 text-xs font-bold">__</span>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//     // </div>
//   );
// }

'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

export default function VendorTable() {
    const vendors = [
        {
            agency: 'Agency 1',
            account: 'Creative , Global ,Airwick',
            questionSet: ['Agency To Reckitt Template version 1'],
            clientParticipants: ['0: Owners', '2: Assessors'],
            agencyParticipants: ['0: Owners', '2: Assessors']
        },
        {
            agency: 'Agency 2',
            account: 'Creative , Global ,Airwick',
            questionSet: ['Agency To Reckitt Template version 2'],
            clientParticipants: ['0: Owners', '2: Assessors'],
            agencyParticipants: ['0: Owners', '2: Assessors']
        }
    ];

    const setupTemplate = (rowData: any) => (
        <div className="flex flex-wrap gap-3">
            {/* First set */}
            <div className="flex flex-column align-items-center gap-1">
                <span className="text-xs text-gray-600 font-medium">1</span>
                <i className="pi pi-check text-white bg-green-600 p-1 border-circle text-sm" />
            </div>
            <div className="flex flex-column align-items-center gap-1">
                <span className="text-xs text-gray-600 font-medium">2</span>
                <span className="text-black text-xs font-bold">__</span>
            </div>

            {/* Second set */}
            <div className="flex flex-column align-items-center gap-1">
                <span className="text-xs text-gray-600 font-medium">3</span>
                <i className="pi pi-check text-white bg-green-600 p-1 border-circle text-sm" />
            </div>
            <div className="flex flex-column align-items-center gap-1">
                <span className="text-xs text-gray-600 font-medium">4</span>
                <span className="text-black text-xs font-bold">__</span>
            </div>
        </div>
    );

    const questionSetTemplate = (rowData: any) => (
        <div>
            {rowData.questionSet.map((q: string, i: number) => (
                <div key={i}>{q}</div>
            ))}
        </div>
    );

    const participantsTemplate = (data: string[]) => (
        <div>
            {data.map((entry, i) => (
                <div key={i}>{entry}</div>
            ))}
        </div>
    );

    const actionBodyTemplate = () => (
        <div className="flex gap-2">
            <Button icon="pi pi-pencil" className="p-button-text p-button-sm" />
            <Button icon="pi pi-trash" className="p-button-text p-button-sm p-button-danger" />
        </div>
    );

    return (
        <div className="p-4">
            {/* Header */}
            <div className="flex justify-content-between align-items-center mb-3 text-sm md:text-base font-semibold">
                <span>
                    Evaluation Name: <span className="font-normal">2025-5, H1 Creative Global</span> &nbsp; Evaluation Type: <span className="font-normal">Annual</span> &nbsp; Reporting Year: <span className="font-normal">2025</span> &nbsp; Reporting
                    Month: <span className="font-normal">5</span>
                </span>
            </div>

            {/* DataTable */}
            <DataTable value={vendors} stripedRows responsiveLayout="scroll" className="text-sm" scrollable>
                <Column field="agency" header="AGENCY" />
                <Column field="account" header="ACCOUNT" />
                <Column body={setupTemplate} header="SET-UP" style={{ width: '200px' }} />
                <Column body={questionSetTemplate} header="QUESTION SET" />
                <Column body={(rowData) => participantsTemplate(rowData.clientParticipants)} header="CLIENT PARTICIPANTS" />
                <Column body={(rowData) => participantsTemplate(rowData.agencyParticipants)} header="AGENCY PARTICIPANTS" />
                <Column body={actionBodyTemplate} header="ACTIONS" style={{ width: '120px' }} />
            </DataTable>
        </div>
    );
}

