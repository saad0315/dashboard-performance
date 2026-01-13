import { DataTable } from "mantine-datatable";
import { useState, useEffect } from "react";
import sortBy from "lodash/sortBy";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import Dropdown from "../Dropdown";
import IconCaretDown from "../Icon/IconCaretDown";
import { deleteLead, getConvertedLeads } from "../../api/leadsApi";
import { Link, NavLink } from "react-router-dom";
import { DataTableSkeleton } from "../Skeletons/Skeletons";
import IconTrashLines from "../Icon/IconTrashLines";
import useDeleteMutation from "../DeleteModals/DeleteMutation";
import DeleteModals from "../DeleteModals/DeleteModals";
import IconEye from "../Icon/IconEye";
import InitialAvatar from "../InitialAvatar";
function debounce(callback, delay) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      callback.apply(this, args);
    }, delay);
  };
}

function ClientTable() {

  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [recordsData, setRecordsData] = useState([]);
  const [search, setSearch] = useState("");
  const [hideCols, setHideCols] = useState([]);
  const [sortStatus, setSortStatus] = useState({
    columnAccessor: "createdAt",
    direction: "asc",
  });
  const isRtl =
    useSelector((state) => state.themeConfig.rtlClass) === "rtl" ? true : false;
  const { user } = useSelector((state) => state.user);
  const debouncedSearch = debounce(setSearch, 300);

  const {
    isLoading,
    data: leadsData,
    status,
  } = useQuery({
    queryKey: ["Leads", search, page],
    queryFn: () => getConvertedLeads(search, page),
    keepPreviousData: true,
  });


  const { deleteMutation, modalOpen, setModalOpen, setSelectedId } =
    useDeleteMutation({
      mutationFn: deleteLead,
      successMessage: "Lead has been deleted successfully",
      queryKey: "Leads",
    });

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setSelectedId(id);
    setModalOpen(true);
  };

  useEffect(() => {
    if (leadsData?.leads) {
      const sortedData = sortBy(leadsData.leads, "createdAt").reverse();
      setRecordsData(sortedData);
    }
  }, [leadsData, sortStatus, page]);


  const handlePageChange = (newPage) => {
    setPage(newPage);
  };


  const showHideColumns = (col, value) => {
    if (hideCols.includes(col)) {
      setHideCols((col) => hideCols.filter((d) => d !== col));
    } else {
      setHideCols([...hideCols, col]);
    }
  };

  const cols = [
    {
      accessor: "userName",
      title: "Name",
      sortable: true,
      hidden: hideCols.includes("userName"),
      render: ({ userName }) => (
        <div className="flex items-center w-max gap-3 protected-content">
          <InitialAvatar name={userName ? userName.charAt(0).toUpperCase() : ""} />
          <div className="capitalize">{userName}</div>
        </div>
      ),
    },
    {
      accessor: "userEmail",
      title: "Email",
      sortable: true,
      hidden: hideCols.includes("userEmail"),
      render: ({ userEmail }) => (
        <div className="w-max group ">
          {user?.role === "admin" ? (
            userEmail
          ) : (
            <div className="">
              <span>{userEmail.slice(0, 6)}</span>
              <span className="blur-sm group-hover:blur-none select-none">{userEmail.slice(4)}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      accessor: "userPhone",
      title: "Phone No.",
      sortable: true,
      hidden: hideCols.includes("userPhone"),
      render: ({ userPhone }) => (
        <div className="w-max group ">
          {user?.role === "admin" ? (
            userPhone
          ) : (
            <div className="">
              <span>{userPhone.slice(0, 6)}</span>
              <span className="blur-sm group-hover:blur-none select-none">{userPhone.slice(4)}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      accessor: "companyName",
      title: "Source",
      sortable: true,
      hidden: hideCols.includes("source"),
    },
    {
      accessor: "createdAt",
      title: "Date",
      sortable: true,
      hidden: hideCols.includes("createdAt"),
      render: ({ createdAt }) => (
        <div className="flex items-center w-max">
          <div>{new Date(createdAt).toLocaleDateString()}</div>
        </div>
      ),
    },
    {
      accessor: "action",
      title: "Action",
      titleClassName: "!text-center",
      render: (data) => (
        <div className="flex items-center w-max mx-auto gap-1">
          <Tippy content="View Details">
            <NavLink to={`/clients/${data?._id}`} type="button">
              <IconEye />
            </NavLink>
          </Tippy>
          <Tippy content="Delete Lead">
            <button onClick={(e) => handleDeleteClick(e, data?._id)}>
              <IconTrashLines className="text-danger hover:text-red-900" />
            </button>
          </Tippy>
        </div>
      ),
    },
  ];

  return (
    <div className="md:col-span-3 sm:col-span-12">
      {" "}
      <ul className="flex space-x-2 rtl:space-x-reverse mb-5">
        <li>
          <Link to="#" className="text-primary hover:underline">
            Clients
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>Table</span>
        </li>
      </ul>
      <div className="">
        <div className="flex md:items-center md:flex-row md:justify-between flex-col mb-5 gap-5">
          <h1 className="screenHeading">
            Client's List
          </h1>{" "}
          <div className="flex md:items-center md:flex-row flex-col gap-5">

            <div className="dropdown">
              <Dropdown
                placement={`${isRtl ? "bottom-end" : "bottom-start"}`}
                btnClassName="!flex items-center border font-semibold border-white-light dark:border-[#253b5c] rounded-md px-4 py-2 text-sm dark:bg-[#1b2e4b] dark:text-white-dark"
                button={
                  <>
                    <span className="ltr:mr-1 rtl:ml-1">Columns</span>
                    <IconCaretDown className="w-5 h-5" />
                  </>
                }
              >
                <ul className="!min-w-[140px]">
                  {cols?.map((col, i) => {
                    return (
                      <li
                        key={i}
                        className="flex flex-col"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <div className="flex items-center px-4 py-1">
                          <label className="cursor-pointer mb-0">
                            <input
                              type="checkbox"
                              checked={!hideCols.includes(col.accessor)}
                              className="form-checkbox"
                              defaultValue={col.accessor}
                              onChange={(event) => {
                                setHideCols(event.target.value);
                                showHideColumns(
                                  col.accessor,
                                  event.target.checked
                                );
                              }}
                            />
                            <span className="ltr:ml-2 rtl:mr-2">
                              {col.title}
                            </span>
                          </label>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </Dropdown>
            </div>
            <div className="text-right">
              <input
                type="text"
                className="form-input w-auto"
                placeholder="Search..."
                onChange={(e) => debouncedSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        {isLoading ? (
          <DataTableSkeleton rows={6} />
        ) : (
          Array.isArray(recordsData) && (
            <div className="datatables">
              <DataTable
                pinLastColumn
                loaderBackgroundBlur={true}
                highlightOnHover
                className="whitespace-nowrap table-hover"
                records={recordsData}
                columns={cols?.map((col) => ({
                  ...col,
                  hidden: hideCols.includes(col.accessor),
                }))}
                totalRecords={leadsData?.leadCount}
                recordsPerPage={pageSize}
                page={page}
                onPageChange={handlePageChange}
                recordsPerPageOptions={PAGE_SIZES}
                onRecordsPerPageChange={setPageSize}
                sortStatus={sortStatus}
                onSortStatusChange={setSortStatus}
                minHeight={200}
                paginationText={({ from, to, totalRecords }) =>
                  `Showing  ${from} to ${to} of ${totalRecords} entries`
                }
              />
            </div>
          )
        )}
      </div>
      <DeleteModals
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onDelete={() => deleteMutation.mutate()}
      />
    </div >
  );
}

export default ClientTable;