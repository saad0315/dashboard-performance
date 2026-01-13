import { companyConstants } from '../constants/constants';

const terms = [
    "You would have the option of unlimited free revisions, edits and rewrites on each page if needed. We have a team of in-house writers, no freelancers - all Americans, who will work on your project on working days, that is, Monday to Friday. All content produced under your project will be ghostwritten by us and needs no mention of our company. You will be the whole and sole owner of the content and can use it anytime and anywhere as per your liking with no objection or interference from our company. All content will be 100% unique & fresh.",
    "Please note that we do not take any cut, royalties, or ownership of your book, it is your book and you will be the only person to keep the proft. We will only take a one-time fee for the Publishing Service.",
    "It mainly depends on how responsive you are on the back and forth feedbacks on the editing and proofreading part, but once fnalized it takes 10 to 12 working days for the book to go online and published.",
    "In case of any dissatisfaction, not getting what was promised,   for any reason the book is not published, you would have the  option to cancel the service at any time during the project and get a refund. We offer a 100% money-back guarantee. We do not have a change of mind policy, No change-of-mind refunds are approved.",
];
const fontSizes = {
    extraBase: "8px",
    base: "10px",
    text_xl: "13px",
};
const Preview = ({ invoiceData }) => {

    const columns = [
        {
            key: 'id',
            label: 'S.NO',
        },
        {
            key: 'title',
            label: 'ITEMS',
        },
        {
            key: 'quantity',
            label: 'QTY',
        },
        {
            key: 'price',
            label: 'PRICE',
            class: 'ltr:text-right rtl:text-left',
        },
        {
            key: 'amount',
            label: 'AMOUNT',
            class: 'ltr:text-right rtl:text-left',
        },
    ];

    return (
        <div>
           
            <div className="panel">
                <div className="flex justify-between flex-wrap gap-4 px-4">
                    <div className="text-2xl font-semibold uppercase">Invoice</div>
                    <div className="shrink-0">
                        <img src="/assets/images/urban-fav.webp" alt="img" className="w-14 ltr:ml-auto rtl:mr-auto" />
                    </div>
                </div>
                <div className="ltr:text-right rtl:text-left px-4">
                    <div className="space-y-1 mt-6 text-white-dark">
                        <div>13 Tetrick Road, Cypress Gardens, Florida, 33884, US</div>
                        <div>+1 (070) 123-4567</div>
                    </div>
                </div>

                <hr className="border-white-light dark:border-[#1b2e4b] my-6" />
                <div className="flex justify-between lg:flex-row flex-col gap-6 flex-wrap">
                    <div className="flex-1">
                        <div className="space-y-1 text-white-dark">
                            <div>Issue For:</div>
                            <div className="text-black dark:text-white font-semibold"> {invoiceData?.billTo?.name}</div>
                            <div> {invoiceData?.billTo?.email}</div>
                            <div>{invoiceData?.billTo?.address}{invoiceData?.billTo?.city}</div>
                            <div>{invoiceData?.billTo?.phone}</div>
                        </div>
                    </div>
                    <div className="flex justify-between sm:flex-row flex-col gap-6 lg:w-2/3">
                        <div className="xl:1/3 lg:w-2/5 sm:w-1/2">
                            <div className="flex items-center w-full justify-between mb-2">
                                <div className="text-white-dark">Invoice :</div>
                                <div>{invoiceData?.invoiceNumber}</div>
                            </div>
                            <div className="flex items-center w-full justify-between mb-2">
                                <div className="text-white-dark">Issue Date :</div>
                                <p>{new Date(invoiceData?.invoiceDate).toLocaleDateString()}</p>
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
                            {invoiceData?.services?.map((item, index) => {
                                return (
                                    <tr key={item._id}>
                                        <td>{index + 1}</td>
                                        <td>{item.type}</td>
                                        <td>{item.quantity}</td>
                                        <td className="ltr:text-right rtl:text-left">${item.unitPrice}</td>
                                        <td className="ltr:text-right rtl:text-left">${item.total}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="grid sm:grid-cols-2 grid-cols-1 px-4 mt-6">
                    <div></div>
                    <div className="ltr:text-right rtl:text-left space-y-2">
                  
                        <div className="flex items-center">
                            <div className="flex-1">Subtotal :</div>
                            <div className="w-[37%]">${invoiceData?.totalAmount}</div>
                        </div>
                
                        <div className="flex items-center">
                            <div className="flex-1">Discount</div>
                            <div className="w-[37%]">$0</div>
                        </div>
                        <div className="flex items-center font-semibold text-lg">
                            <div className="flex-1">Grand Total</div>
                            <div className="w-[37%]">${invoiceData?.totalAmount}</div>
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
                <div className={` col-span-1 flex flex-col items-end md:px-5`}>
                    <p className={`${fontSizes.base}`}>{companyConstants.companyUrl}</p>
                    <p className={`${fontSizes.base}`}>{companyConstants.billingEmail}</p>
                    <p className={`${fontSizes.base}`}>{companyConstants.phoneNumber}</p>
                </div>
            </div>
        </div>
    );
};

export default Preview;
