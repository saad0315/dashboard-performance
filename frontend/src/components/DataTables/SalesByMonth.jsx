import { DataTable } from "mantine-datatable";
import { useState, Fragment, useEffect } from "react";
import sortBy from "lodash/sortBy";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSales } from "../../api/salesApi";
import { DataTableSkeleton } from "../Skeletons/Skeletons";
import { coloredToast } from "../Alerts/SimpleAlert";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import IconX from "../Icon/IconX";
import { Dialog, Transition } from "@headlessui/react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Tippy from "@tippyjs/react";
import Select from "react-select";
import InitialAvatar from "../InitialAvatar";


function MonthlySaleTable({ isLoading, salesData, selectedMonth }) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [initialRecords, setInitialRecords] = useState([]);
  const [modal17, setModal17] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [recordsData, setRecordsData] = useState([]);
  const [hideCols, setHideCols] = useState([]);
  const [sortStatus, setSortStatus] = useState({
    columnAccessor: "userName",
    direction: "asc",
  });
  const { user } = useSelector((state) => state.user);
  const isRtl = useSelector((state) => state.themeConfig.rtlClass) === "rtl";

  useEffect(() => {
    if (salesData?.sales) {
      const sortedUsers = sortBy(salesData?.sales, "createdAt");
      setInitialRecords(sortedUsers);
      setRecordsData(sortedUsers);
    }
  }, [salesData]);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecordsData(initialRecords.slice(from, to));
  }, [page, pageSize, initialRecords]);

  useEffect(() => {
    if (salesData?.sales) {
      let filteredSales = salesData.sales;

      // Only filter if a month is selected
      if (selectedMonth) {
        filteredSales = filteredSales.filter((sale) => {
          const saleDate = new Date(sale.createdAt);
          const saleMonth = saleDate.getMonth() + 1;
          const saleYear = saleDate.getFullYear();
          return saleMonth === selectedMonth.month && saleYear === selectedMonth.year;
        });
      }

      const sortedSales = sortBy(filteredSales, "createdAt");
      setInitialRecords(filteredSales);
      setRecordsData(filteredSales);
    }
  }, [salesData, selectedMonth]);



  const showHideColumns = (col) => {
    setHideCols((prevHideCols) =>
      prevHideCols.includes(col)
        ? prevHideCols.filter((d) => d !== col)
        : [...prevHideCols, col]
    );
  };

  const mutation = useMutation({
    mutationKey: ["updateSale"],
    mutationFn: (data) => updateSales(data, selectedSale?._id),
    onSuccess: (response) => {
      setModal17(false);
      queryClient.invalidateQueries("Sales");

      coloredToast(
        "success",
        "Sale Updated Successfully !",
        "top",
        null,
        null,
        15000
      );
    },
    onError: (error) => {
      coloredToast("danger", error?.response?.data?.message, "top");
    },
  });

  const formatDate = (date) => {
    if (date) {
      const dt = new Date(date);
      const month =
        dt.getMonth() + 1 < 10 ? "0" + (dt.getMonth() + 1) : dt.getMonth() + 1;
      const day = dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate();
      return `${day}/${month}/${dt.getFullYear()}`;
    }
    return "";
  };

  const cols = [
    { accessor: "amount", title: "Amount" },
    {
      accessor: "lead.userName",
      title: "Client Name",
      sortable: true,
      hidden: hideCols.includes("lead.userName"),
    },
    {
      accessor: "salesPerson.userName",
      title: "Sales Person",
      sortable: true,
      hidden: hideCols.includes("salesPerson.userName"),
      render: ({ salesPerson }) => (
        <div className="flex items-center w-max gap-3">
          {salesPerson?.profileImgUrl ? (
            <img
              className="rounded-full w-8 h-8 object-cover"
              src={`https://bellevue-portal.b-cdn.net/${salesPerson?.profileImgUrl}`}
              alt="userProfile"
            />
          ) : (
            <div className="text-lg  rounded-full w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-700">
              <InitialAvatar name={salesPerson?.userName ? salesPerson?.userName.charAt(0).toUpperCase() : ""} />
            </div>
          )}
          <div className="capitalize">{salesPerson?.userName}</div>
        </div>
      ),
    },
    {
      accessor: "services",
      title: "Services",
      render: ({ services }) => {
        if (!Array.isArray(services)) {
          return <span>No servicessss</span>;
        }
        return (
          <div className="flex items-center w-max mx-auto">
            <Tippy content={services.length > 1 ? services?.slice(0).join(", ") : ""} placement="top">
              <span>{services[0]}</span>
            </Tippy>
          </div>
        );
      },
    },
    {
      accessor: "date",
      title: "Date",
      render: ({ date }) => formatDate(date),
    },

    {
      accessor: "saleType",
      title: "Sale Type",
      sortable: true,
      hidden: hideCols.includes("saleType"),
      render: ({ saleType }) => (
        <span className={` capitalize`}>
          {saleType}
        </span>
      ),
    },
    // {
    //   accessor: "refunded",
    //   title: "Refunded",
    //   sortable: true,
    //   hidden: hideCols.includes("refunded"),
    //   render: (value) => (
    //     <span className={`badge bg-${value ? "success" : "danger"}`}>
    //       {value ? "No" : "Yes"}
    //     </span>
    //   ),
    // },
    // { accessor: "refundAmount", title: "Refund Amount" },
  ];
  const Services = [
    "Marketing",
    "Publishing",
    "Designing",
    "Writing",
    "Audio Book",
    "Ebook",
    "Others",
  ]
  return (
    <div className="">
      {/* <div className="md:col-span-3 sm:col-span-12 h-full "> */}
      <div className="panel">
        <div className="flex md:items-center md:flex-row md:justify-between flex-col mb-5 gap-5">
          <h5 className="font-semibold text-lg dark:text-white-light">Sales</h5>

        </div>
        {isLoading ? (
          <DataTableSkeleton rows={5} />
        ) : (
          Array.isArray(recordsData) && (
            <div className="datatables">
              <DataTable
                pinLastColumn
                fetching={isLoading}
                loaderBackgroundBlur={true}
                highlightOnHover
                className="whitespace-nowrap table-hover"
                records={recordsData}
                onRowClick={({ record }) => {
                  setSelectedSale(record);
                  setModal17(true);
                }}
                columns={cols?.map((col) => ({
                  ...col,
                  hidden: hideCols.includes(col.accessor),
                }))}
                totalRecords={initialRecords.length}
                recordsPerPage={pageSize}
                page={page}
                onPageChange={setPage}
                recordsPerPageOptions={PAGE_SIZES}
                onRecordsPerPageChange={setPageSize}
                sortStatus={sortStatus}
                onSortStatusChange={setSortStatus}
                minHeight={200}
                paginationText={({ from, to, totalRecords }) =>
                  `Showing ${from} to ${to} of ${totalRecords} entries`
                }
              />
            </div>
          )
        )}
      </div>
      <Transition appear show={modal17} as={Fragment}>
        <Dialog as="div" open={modal17} onClose={() => setModal17(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0" />
          </Transition.Child>
          <div
            id="standard_modal"
            className="fixed inset-0 bg-[black]/90 z-[999] overflow-y-auto"
          >
            <div className="flex min-h-screen items-start justify-center px-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0  text-black dark:text-white-dark">
                  <button
                    type="button"
                    className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                    onClick={() => setModal17(false)}
                  >
                    <IconX />
                  </button>
                  {/* <h3 className="text-xl py-7 mb-5 font-semibold text-black dark:text-white-light"></h3> */}
                  <h2 className="text-xl font-extrabold uppercase !leading-snug text-primary md:text-2xl">
                    Sales Detail
                  </h2>
                  <div className="datatables">
                    <Formik
                      initialValues={{
                        id: selectedSale?._id || '',
                        amount: selectedSale?.amount || '',
                        services: selectedSale?.services || '',
                        saleType: selectedSale?.saleType || '',
                        salesPerson: selectedSale?.salesPerson || '',
                        refunded: selectedSale?.refunded === false ? "false" : "true",
                        date: selectedSale?.date || '',
                        refundAmount: selectedSale?.refundAmount || 0,
                        saleDescription: selectedSale?.saleDescription || '',
                      }}
                      onSubmit={(values) => {
                        const combinedValues = {
                          lead: selectedSale?.lead?._id,
                          ...values,
                          comments: values?.comments && values.comments.trim() ? [
                            ...(selectedSale?.comments || []),
                            {
                              text: values.comments,
                              postedBy: user?._id,
                            },
                          ] : (selectedSale?.comments || []),
                        };
                        mutation.mutate(combinedValues);
                      }}
                    >
                      {({ values, setFieldValue }) => (
                        <Form
                          style={{
                            maxWidth: 600,
                          }}
                          className="mx-auto"
                        >
                          <div className="flex w-full xl:flex-row md:flex-col md:gap-0 fl:gap-0 sm:gap-0 flex-col xl:gap-3 fl:flex-col sm:flex-col">
                            <div className="w-full mb-2">
                              <label htmlFor="amount">Amount</label>
                              <Field
                                id="amount"
                                name="amount"
                                className="form-input"
                                placeholder="Enter Sale Amount"
                              />
                              <ErrorMessage
                                name="amount"
                                component="div"
                                className="text-red-500"
                              />
                            </div>
                          </div>
                          <div className="w-full mb-2">
                            <label htmlFor="services">Services</label>
                            <Field name="services">
                              {({ field, form }) => (
                                <Select
                                  isMulti
                                  options={Services.map((service) => ({ value: service, label: service }))} // Convert string array to objects
                                  placeholder="Select Services"
                                  className="form-select mb-2 flex-1 !border-none p-0"
                                  value={field.value?.map((service) => ({ value: service, label: service })) || []} // Convert selected values back to objects
                                  onChange={(selectedOptions) => {
                                    form.setFieldValue(
                                      "services",
                                      selectedOptions.map((option) => option.value) // Store only string values in form
                                    );
                                  }}
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="services"
                              component="div"
                              className="text-red-500"
                            />
                          </div>
                          <div className="w-full mb-2">
                            <label htmlFor="saleType">Sale Type</label>
                            <Field
                              as="select"
                              id="saleType"
                              name="saleType"
                              className="form-select"
                              onChange={(e) =>
                                setFieldValue("saleType", e.target.value)
                              }
                            >
                              <option value="" disabled selected hidden>
                                Select Sale Type
                              </option>
                              {[
                                { item: "Front Sell", value: "frontSell" },
                                { item: "Up Sell", value: "upSell" },
                                { item: "Cross Sell", value: "crossSell" },
                              ].map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.item}
                                </option>
                              ))}
                            </Field>
                            <ErrorMessage
                              name="saleType"
                              component="div"
                              className="text-red-500"
                            />
                          </div>
                          <div>
                            <label htmlFor="saleDescription">Sale Description</label>
                            <Field
                              as="textarea"
                              name="saleDescription"
                              className="form-textarea protected-content"
                              rows="3"
                            />
                          </div>

                          <div className="w-full mb-2">
                            <label htmlFor="refunded">Refunded</label>
                            <Field
                              as="select"
                              // id="refunded"
                              name="refunded"
                              className="form-select"
                            >
                              <option value="" disabled >
                                Select If Refunded
                              </option>
                              <option value="true">True</option>
                              <option value="false">False</option>
                            </Field>
                            <ErrorMessage name="refunded" component="div" className="text-red-500" />
                          </div>

                          <div className="w-full mb-2">
                            <label htmlFor="date">Date</label>
                            <Flatpickr
                              name="date"
                              placeholder="Select the Date"
                              options={{ dateFormat: "Y-m-d", position: "auto left" }}
                              className="form-input"
                              value={values.date}
                              onChange={(selectedDate) => {
                                setFieldValue("date", selectedDate[0]);  // Update Formik's state with the selected date
                              }}
                            />
                          </div>
                          {values.refunded === "true" && (
                            <div className="w-full mb-2">
                              <label htmlFor="refundAmount">Refund Amount</label>
                              <Field
                                id="refundAmount"
                                name="refundAmount"
                                className="form-input"
                                placeholder="Enter Sale Refund Amount"
                              />
                              <ErrorMessage
                                name="refundAmount"
                                component="div"
                                className="text-red-500"
                              />
                            </div>
                          )}
                          <div className="form-group flex-1">
                            <label htmlFor="comments">Comments</label>
                            <Field
                              as="textarea"
                              rows="4"
                              name="comments"
                              type="text"
                              className="form-input"
                              placeholder="Write comments here... "
                            />
                            <ErrorMessage
                              name="comments"
                              component="div"
                              className="text-red-500"
                            />
                          </div>
                          <div className="flex justify-center items-center">
                            <button
                              disabled={mutation.isPending}
                              type="submit"
                              className="btn btn-primary !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                            >
                              {mutation.isPending && (
                                <span className="animate-spin border-2  border-primary border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle "></span>
                              )}
                              Update Sale
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>

                    <div>
                      {selectedSale?.comments?.length > 0 &&
                        selectedSale?.comments
                          ?.slice()
                          .sort(
                            (a, b) =>
                              new Date(b.createdAt) - new Date(a.createdAt)
                          )
                          .map((item, index) => (
                            <article
                              key={index}
                              className="p-6 text-base bg-white border-t border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                            >
                              <footer className="flex justify-between items-center mb-2">
                                <div className="flex items-center">
                                  <p className=" capitalize inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                                    {item?.postedBy?.profileImageUrl ? (
                                      <img
                                        className="mr-2 w-6 h-6 rounded-full"
                                        src={item.postedBy?.profileImageUrl}
                                        alt={item?.postedBy?.userName}
                                      />
                                    ) : (
                                      <div className="text-sm  mr-2 w-6 h-6 rounded-full flex items-center justify-center bg-gray-200 text-gray-700">
                                        {item?.postedBy?.userName
                                          ? item?.postedBy?.userName
                                            .charAt(0)
                                            .toUpperCase()
                                          : ""}
                                      </div>
                                    )}

                                    {item?.postedBy?.userName}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {new Date(
                                      item.createdAt
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </footer>
                              <p className="text-gray-500 dark:text-gray-400">
                                {item?.text}
                              </p>
                            </article>
                          ))}
                    </div>

                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div >
        </Dialog >
      </Transition >
    </div>
  );
}

export default MonthlySaleTable;

// const randomColor = () => {
//     const color = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'];
//     const random = Math.floor(Math.random() * color.length);
//     return color[random];
// };

// const randomStatus = () => {
//     const status = ['PAID', 'APPROVED', 'FAILED', 'CANCEL', 'SUCCESS', 'PENDING', 'COMPLETE'];
//     const random = Math.floor(Math.random() * status.length);
//     return status[random];
// };



// useEffect(() => {
//   if (salesData?.salesByMonth) {
//     const lastIndex = salesData?.salesByMonth?.length - 1;
//     const lastMonthYear = salesData?.salesByMonth[lastIndex]?._id;
//     setSelectedMonth({
//       year: lastMonthYear?.year,
//       month: lastMonthYear?.month,
//     });
//   }
// }, [salesData]);

// console.log("date" , selectedMonth , salesData?.sales)

// useEffect(() => {
//   if (selectedMonth && salesData?.salesByMonth) {
//     const filteredData = salesData?.salesByMonth.find(
//       (item) =>
//         item?._id?.month === selectedMonth?.month &&
//         item?._id?.year === selectedMonth?.year
//     );
//     if (filteredData) {
//       const sortedSales = sortBy(filteredData?.sales, "createdAt");
//       setInitialRecords(sortedSales);
//       const filteredSales = sortedSales?.filter((item) =>
//         item?.amount?.toString().includes(search.toLowerCase())
//       );
//       setRecordsData(filteredSales);
//       setPage(1);
//     }
//   }
// }, [search, selectedMonth, salesData]);