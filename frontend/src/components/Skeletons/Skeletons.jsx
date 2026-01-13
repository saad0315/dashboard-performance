import React from "react";

export const SalesTeamCardSkeleton = () => {
  return (
    <div className="relative max-w-[25rem] w-full panel h-full animate-pulse mx-auto">
      <div className="absolute top-0 right-0 cursor-pointer p-4">
        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
      </div>
      <div className="flex items-center justify-between border-b border-white-light dark:border-[#1b2e4b] -m-5 mb-5 p-5">
        <div className="flex">
          <div className="media-aside align-self-start">
            <div className="shrink-0 ring-2 ring-white-light dark:ring-dark rounded-full ltr:mr-4 rtl:ml-4 w-10 h-10 bg-gray-300"></div>
          </div>
          <div className="font-semibold">
            <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-16"></div>
          </div>
        </div>
      </div>
      <div className="font-semibold text-center pb-8">
        <div className="mb-4 h-4 bg-gray-300 rounded w-32 mx-auto"></div>
        <div className="flex items-center justify-center gap-3 pb-8">
          <div className="w-10 h-10 ring-2 ring-white-light dark:ring-dark rounded-lg bg-gray-300"></div>
          <div className="w-10 h-10 ring-2 ring-white-light dark:ring-dark rounded-lg bg-gray-300"></div>
          <div className="w-10 h-10 ring-2 ring-white-light dark:ring-dark rounded-lg bg-gray-300"></div>
          <div className="w-10 h-10 ring-2 ring-white-light dark:ring-dark rounded-lg bg-gray-300"></div>
        </div>
        <div className="w-full absolute bottom-0 flex items-center justify-between p-5 -mx-5">
          <div className="btn btn-secondary btn-lg w-full border-0 bg-gradient-to-r from-[#3d38e1] to-[#1e9afe] h-10"></div>
        </div>
      </div>
    </div>
  );
};

export const SalesPersonCardSkeleton = () => {
  return (
    <div className="mx-auto max-w-[18rem] w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] hover:shadow-none hover:dark:border-primary border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none rounded  p-5">
      <div className="animate-pulse text-center text-black-light">
        <div className="mb-5 w-20 h-20 rounded-full bg-gray-300 mx-auto"></div>
        <div className="h-4 bg-gray-300 rounded w-32 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-48 mx-auto mb-4"></div>
        <div className="flex justify-center items-center text-[#e2a03f] my-4">
          <div className="h-6 w-6 bg-gray-300 rounded-full mx-1"></div>
          <div className="h-6 w-6 bg-gray-300 rounded-full mx-1"></div>
          <div className="h-6 w-6 bg-gray-300 rounded-full mx-1"></div>
          <div className="h-6 w-6 bg-gray-300 rounded-full mx-1"></div>
          <div className="h-6 w-6 bg-gray-300 rounded-full mx-1"></div>
        </div>
        <div className="grid grid-cols-3 mx-auto mt-5 gap-4 ">
          <div className="flex flex-col items-center">
            <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
            <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
            <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
            <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export const DataTableSkeleton = ({ rows }) => {
  return (
    <div className="animate-pulse">
      {/* <div className="flex justify-between items-center mb-3 ">
        <div className="w-16 h-6 bg-gray-300 rounded"></div>
        <div className="w-24 h-6 bg-gray-300 rounded"></div>
        <div className="w-20 h-6 bg-gray-300 rounded"></div>
        <div className="w-16 h-6 bg-gray-300 rounded"></div>
        <div className="w-16 h-6 bg-gray-300 rounded"></div>
        <div className="w-24 h-6 bg-gray-300 rounded"></div>
      </div> */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              {[...Array(rows)].map((_, cellIndex) => (
                <th
                  key={cellIndex}
                  className="w-16 h-10 bg-gray-300 rounded"
                ></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, rowIndex) => (
              <tr key={rowIndex}>
                {[...Array(rows)].map((_, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="w-24 h-10 bg-gray-300 rounded"
                  ></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const RecentTransactionSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="flex items-center">
        <span className="shrink-0 grid place-content-center w-9 h-9 rounded-md bg-gray-300"></span>
        <div className="px-3 flex-1">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded mt-2 w-1/2"></div>
        </div>
        <span className="text-base px-1 ltr:ml-auto rtl:mr-auto whitespace-pre h-4 bg-gray-300 rounded w-1/4"></span>
      </div>
    </div>
  );
};
export const SkeletonSummaryCard = () => {
  return (
    <div className="animate-pulse flex items-center">
      <div className="w-9 h-9 ltr:mr-3 rtl:ml-3">
        <div className="bg-gray-300 rounded-full w-9 h-9 grid place-content-center"></div>
      </div>
      <div className="flex-1">
        <div className="flex font-semibold text-white-dark mb-2">
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="h-4 bg-gray-300 rounded ltr:ml-auto rtl:mr-auto w-1/4"></div>
        </div>
        <div className="w-full rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b] shadow">
          <div className="bg-gray-300 w-full h-full rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
