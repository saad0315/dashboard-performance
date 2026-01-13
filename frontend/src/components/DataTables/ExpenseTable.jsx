import { DataTable } from "mantine-datatable";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { deleteExpense, getExpense } from "../../api/expenseApi";
import { Link } from "react-router-dom";
import { DataTableSkeleton } from "../Skeletons/Skeletons";
import useDeleteMutation from "../DeleteModals/DeleteMutation";
import DeleteModals from "../DeleteModals/DeleteModals";
import Tippy from "@tippyjs/react";
import IconTrashLines from "../Icon/IconTrashLines";

function ExpenseTable() {
  const { isLoading, data: expenseData } = useQuery({
    queryKey: ["expense"],
    queryFn: getExpense,
  });
  const { deleteMutation, modalOpen, setModalOpen, setSelectedId } =
    useDeleteMutation({
      mutationFn: deleteExpense,
      successMessage: "Expense has been Deleted successfully",
      queryKey: "expense",
    });

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setModalOpen(true);
  };
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [initialRecords, setInitialRecords] = useState([]);
  const [recordsData, setRecordsData] = useState([]);
  const [search, setSearch] = useState("");
  const [hideCols, setHideCols] = useState([]);
  const [sortStatus, setSortStatus] = useState({
    columnAccessor: "category",
    direction: "asc",
  });
  const [selectedMonth, setSelectedMonth] = useState(null);

  const isRtl = useSelector((state) => state.themeConfig.rtlClass) === "rtl";

  useEffect(() => {
    if (expenseData?.expensesByMonth) {
      const lastIndex = expenseData?.expensesByMonth?.length - 1;
      const lastMonthYear = expenseData?.expensesByMonth[lastIndex]?._id;
      setSelectedMonth({
        year: lastMonthYear?.year,
        month: lastMonthYear?.month,
      });
    }
  }, [expenseData]);

  useEffect(() => {
    if (selectedMonth && expenseData?.expensesByMonth) {
      const filteredData = expenseData.expensesByMonth.find(
        (item) =>
          item?._id?.month === selectedMonth?.month &&
          item?._id?.year === selectedMonth?.year
      );

      if (filteredData) {
        const sortedExpenses = filteredData.expenses.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        const filteredExpenses = sortedExpenses.filter((item) => {
          return (
            item.category.toLowerCase().includes(search.toLowerCase()) ||
            item?.amount
              .toString()
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            item?.date.toLowerCase().includes(search.toLowerCase())
          );
        });

        setInitialRecords(sortedExpenses);
        setRecordsData(filteredExpenses);
      } else {
        setInitialRecords([]);
        setRecordsData([]);
      }
    }
  }, [selectedMonth, expenseData, search]);

  const handleMonthChange = (value) => {
    const [year, month] = value.split("-");
    setSelectedMonth({ year: parseInt(year, 10), month: parseInt(month, 10) });
  };

  const cols = [
    {
      accessor: "category",
      title: "Category",
      sortable: true,
      hidden: hideCols.includes("category"),
    },
    {
      accessor: "amount",
      title: "Amount",
      sortable: true,
      hidden: hideCols.includes("amount"),
    },
    {
      accessor: "date",
      title: "Date",
      sortable: true,
      hidden: hideCols.includes("date"),
      render: ({ date }) => (
        <div className="flex items-center w-max">
          <div>{new Date(date).toLocaleDateString()}</div>
        </div>
      ),
    },
    {
      accessor: "action",
      title: "Action",
      titleClassName: "!text-center",
      render: (data) => (
        <div className="flex items-center w-max mx-auto">
          <Tippy content="Delete Expense">
            <button onClick={() => handleDeleteClick(data?._id)}>
              <IconTrashLines className="text-danger hover:text-red-900" />
            </button>
          </Tippy>
        </div>
      ),
    },
  ];

  return (
    <div className="md:col-span-3 sm:col-span-12">
      <ul className="flex space-x-2 rtl:space-x-reverse mb-5">
        <li>
          <Link to="#" className="text-primary hover:underline">
            Expense
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>Table</span>
        </li>
      </ul>

      <div className="panel">
        <div className="flex md:items-center md:flex-row md:justify-between flex-col mb-5 gap-5">
          <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">
            Expenses
          </h1>
          <div className="max-w-lg w-full flex md:items-center md:flex-row flex-col gap-5">
            <select
              id="category"
              name="category"
              className="form-select"
              defaultValue={
                selectedMonth
                  ? `${selectedMonth?.year}-${selectedMonth?.month}`
                  : ""
              }
              onChange={(e) => handleMonthChange(e.target.value)}
            >
              <option disabled value="" hidden label="Select Month" />
              {expenseData?.expensesByMonth.map((item, index) => (
                <option
                  key={index}
                  value={`${item?._id?.year}-${item?._id?.month}`}
                >
                  {item?._id?.year}-{item?._id?.month}
                </option>
              ))}
            </select>

            <input
              type="text"
              className="form-input w-auto"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="datatables">
          {isLoading ? (
            <DataTableSkeleton rows={3} />
          ) : (
            <DataTable
              pinLastColumn
              highlightOnHover
              className="whitespace-nowrap table-hover"
              records={recordsData}
              columns={cols?.map((col) => ({
                ...col,
                hidden: hideCols.includes(col?.accessor),
              }))}
              // columns={[
              //   {
              //     accessor: "category",
              //     title: "Category",
              //     sortable: true,
              //     hidden: hideCols.includes("category"),
              //   },
              //   {
              //     accessor: "amount",
              //     title: "Amount",
              //     sortable: true,
              //     hidden: hideCols.includes("amount"),
              //   },
              //   {
              //     accessor: "date",
              //     title: "Date",
              //     sortable: true,
              //     hidden: hideCols.includes("date"),
              //     render: ({ date }) => (
              //       <div className="flex items-center w-max">
              //         <div>{new Date(date).toLocaleDateString()}</div>
              //       </div>
              //     ),
              //   },
              // ]}
              totalRecords={recordsData?.length}
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
          )}
        </div>
      </div>
      <DeleteModals
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onDelete={() => deleteMutation.mutate()}
      />
    </div>
  );
}

export default ExpenseTable;
