import { Link, useParams } from 'react-router-dom';
import IconDownload from '../components/Icon/IconDownload';
import IconPlus from '../components/Icon/IconPlus';
import IconEdit from '../components/Icon/IconEdit';
import { companyConstants } from '../constants/constants';
import { getInvoiceId } from '../api/invoiceApi';
import { useQuery } from '@tanstack/react-query';
import { formatDate } from '../utils/Utils';

const InvoicePreview = () => {
    const { id } = useParams();

    const {
        isLoading,
        data: selectedInvoice,
        status,
    } = useQuery({
        queryKey: ['invoices'],
        queryFn: () => getInvoiceId(id),
    });

    const columns = [
        {
            key: 'id',
            label: 'S.NO',
        },
        {
            key: 'name',
            label: 'PROJECT NAME',
        },
        {
            key: 'type',
            label: 'PROJECT TYPE',
        },
        {
            key: 'amount',
            label: 'AMOUNT',
            class: 'ltr:text-right rtl:text-left',
        },
    ];
    const terms = [
        'You would have the option of unlimited free revisions, edits and rewrites on each page if needed. We have a team of in-house writers, no freelancers - all Americans, who will work on your project on working days, that is, Monday to Friday. All content produced under your project will be ghostwritten by us and needs no mention of our company. You will be the whole and sole owner of the content and can use it anytime and anywhere as per your liking with no objection or interference from our company. All content will be 100% unique & fresh.',
        'Please note that we do not take any cut, royalties, or ownership of your book, it is your book and you will be the only person to keep the proft. We will only take a one-time fee for the Publishing Service.',
        'It mainly depends on how responsive you are on the back and forth feedbacks on the editing and proofreading part, but once fnalized it takes 10 to 12 working days for the book to go online and published.',
        'In case of any dissatisfaction, not getting what was promised,   for any reason the book is not published, you would have the  option to cancel the service at any time during the project and get a refund. We offer a 100% money-back guarantee. We do not have a change of mind policy, No change-of-mind refunds are approved.',
    ];

    return (
        <div>
            <div className="flex items-center lg:justify-end justify-center flex-wrap gap-4 mb-6">
                <button type="button" className="btn btn-success gap-2">
                    <IconDownload />
                    Download
                </button>
                <Link to="/apps/invoice/add" className="btn btn-secondary gap-2">
                    <IconPlus />
                    Create
                </Link>

                <Link to="/apps/invoice/edit" className="btn btn-warning gap-2">
                    <IconEdit />
                    Edit
                </Link>
            </div>
            <div className="panel">
                <div className="flex justify-between flex-wrap gap-4 px-4">
                    <div className="text-2xl font-semibold uppercase">Invoice</div>
                    <div className="shrink-0">
                        <img src="https://madcompm.b-cdn.net/madcom-pm/brands/bellevuelogo.png" alt="img" className="w-14 ltr:ml-auto rtl:mr-auto" />
                    </div>
                </div>
                <div className="ltr:text-right rtl:text-left px-4">
                    <div className="space-y-1 mt-6 text-white-dark">
                        <div>{companyConstants.companyAddress}</div>
                        <div>{companyConstants.billingEmail}</div>
                        <div>{companyConstants.phoneNumber}</div>
                    </div>
                </div>

                <hr className="border-white-light dark:border-[#1b2e4b] my-6" />
                <div className="flex justify-between lg:flex-row flex-col gap-6 flex-wrap">
                    <div className="flex-1">
                        <div className="space-y-1 text-white-dark">
                            <div>Issue For:</div>
                            <div className="text-black dark:text-white font-semibold">{selectedInvoice?.invoice?.customer?.userName}</div>
                            <div>{selectedInvoice?.invoice?.customer?.userEmail}</div>
                        </div>
                    </div>
                    <div className="flex justify-between sm:flex-row flex-col gap-6 lg:w-2/3">
                        <div className="xl:1/3 lg:w-2/5 sm:w-1/2">
                            <div className="flex items-center w-full justify-between mb-2">
                                <div className="text-white-dark">Invoice :</div>
                                <div>{selectedInvoice?.invoice?.invoiceNumber}</div>
                            </div>
                            <div className="flex items-center w-full justify-between mb-2">
                                <div className="text-white-dark">Issue Date :</div>
                                <div>{formatDate(selectedInvoice?.invoice?.invoiceDate)}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="table-responsive mt-6">
                    <table className="table-striped">
                        <thead>
                            <tr>
                                {columns.map((column) => {
                                    return (
                                        <th key={column.key} className={column?.class}>
                                            {column.label}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{selectedInvoice?.invoice?.invoiceNumber}</td>
                                <td>{selectedInvoice?.invoice?.project?.projectName}</td>
                                <td>{selectedInvoice?.invoice?.project?.projectType}</td>
                                <td className="ltr:text-right rtl:text-left">${selectedInvoice?.invoice?.totalAmount}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="grid sm:grid-cols-2 grid-cols-1 px-4 mt-6">
                    <div>
                        <p className="font-bold">Services Includes :</p>
                        <ul className="list-disc pl-4   ">
                            {selectedInvoice?.invoice?.project?.services?.map((item, index) => (
                                <li className="text-xs font-medium my-2" key={index}>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="ltr:text-right rtl:text-left space-y-2">
                        <div className="flex items-center">
                            <div className="flex-1">Paid To Date</div>
                            <div className="w-[37%]">${selectedInvoice?.invoice?.paidToDate}</div>
                        </div>
                        <div className="flex items-center">
                            <div className="flex-1">Balance Due</div>
                            <div className="w-[37%]">${selectedInvoice?.invoice?.remainingAmount}</div>
                        </div>
                        <div className="flex items-center font-semibold text-lg">
                            <div className="flex-1">Grand Total</div>
                            <div className="w-[37%]">${selectedInvoice?.invoice?.totalAmount}</div>
                        </div>
                    </div>
                </div>
                <div className=" grid  md:grid-cols-3  gap-8 mt-8">
                    <div className="col-span-2 ">
                        <p className="font-bold">Terms:</p>
                        <ul className="list-disc pl-4   ">
                            {terms?.map((item, index) => (
                                <li className="text-xs font-medium my-2" key={index}>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <hr className="border-white-light dark:border-[#1b2e4b] my-6" />
                <div className={` col-span-1 flex flex-col items-end md:px-5`}>
                    <p>{companyConstants.companyUrl}</p>
                    <p>{companyConstants.billingEmail}</p>
                    <p>{companyConstants.phoneNumber}</p>
                </div>
            </div>
        </div>
    );
};

export default InvoicePreview;
