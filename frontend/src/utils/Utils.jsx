export const formatDate = (date) => {
  if (date) {
    const dt = new Date(date);
    const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
    const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
    return day + '/' + month + '/' + dt.getFullYear();
  }
  return '';
};

export const getRevenueChart = (isDark, isRtl) => ({
  series: [
    {
      name: "Income",
      data: [
        16800, 16800, 15500, 17800, 15500, 17000, 19000, 16000, 15000, 17000,
        14000, 17000,
      ],
    },
    {
      name: "Expenses",
      data: [
        16500, 17500, 16200, 17300, 16000, 19500, 16000, 17000, 16000, 19000,
        18000, 19000,
      ],
    },
  ],
  options: {
    chart: {
      height: 325,
      type: "area",
      fontFamily: "Nunito, sans-serif",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },

    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      curve: "smooth",
      width: 2,
      lineCap: "square",
    },
    dropShadow: {
      enabled: true,
      opacity: 0.2,
      blur: 10,
      left: -7,
      top: 22,
    },
    colors: isDark ? ["#2196F3", "#E7515A"] : ["#1B55E2", "#E7515A"],
    markers: {
      discrete: [
        {
          seriesIndex: 0,
          dataPointIndex: 6,
          fillColor: "#1B55E2",
          strokeColor: "transparent",
          size: 7,
        },
        {
          seriesIndex: 1,
          dataPointIndex: 5,
          fillColor: "#E7515A",
          strokeColor: "transparent",
          size: 7,
        },
      ],
    },
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        show: true,
      },
      labels: {
        offsetX: isRtl ? 2 : 0,
        offsetY: 5,
        style: {
          fontSize: "12px",
          cssClass: "apexcharts-xaxis-title",
        },
      },
    },
    yaxis: {
      tickAmount: 7,
      labels: {
        formatter: (value) => {
          return value / 1000 + "K";
        },
        offsetX: isRtl ? -30 : -10,
        offsetY: 0,
        style: {
          fontSize: "12px",
          cssClass: "apexcharts-yaxis-title",
        },
      },
      opposite: isRtl ? true : false,
    },
    grid: {
      borderColor: isDark ? "#191E3A" : "#E0E6ED",
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      fontSize: "16px",
      markers: {
        width: 10,
        height: 10,
        offsetX: -2,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
    },
    tooltip: {
      marker: {
        show: true,
      },
      x: {
        show: false,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: !1,
        opacityFrom: isDark ? 0.19 : 0.28,
        opacityTo: 0.05,
        stops: isDark ? [100, 100] : [45, 100],
      },
    },
  },
});

export const getLeadsByCategory = (isDark) => ({
  series: [44, 55, 41, 17, 15],
  options: {
    chart: {
      type: "donut",
      height: 460,
      fontFamily: "Nunito, sans-serif",
    },
    dataLabels: {
      enabled: false,
    },
    colors: isDark
      ? ["#730114", "#7301f4", "#16a34a", "#dc2626", "#0891b2", "#6b7280", "#d97706"]
      : ["#730114", "#7301f4", "#16a34a", "#dc2626", "#0891b2", "#6b7280", "#d97706"],
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "14px",
      markers: {
        width: 10,
        height: 10,
        offsetX: -2,
      },
      height: 50,
      offsetY: 20,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          background: "transparent",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "29px",
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: "26px",
              color: isDark ? "#bfc9d4" : undefined,
              offsetY: 16,
              formatter: (val) => {
                return val;
              },
            },
            total: {
              show: true,
              label: "Total",
              color: "#888ea8",
              fontSize: "29px",
              formatter: (w) => {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              },
            },
          },
        },
      },
    },
    labels: ["New", "FollowUp", "Converted", "Lost", "Contacted", "Invalid", "Qualified"],
    states: {
      hover: {
        filter: {
          type: "none",
          value: 0.5,
        },
      },
      active: {
        filter: {
          type: "none",
          value: 0.15,
        },
      },
    },
  },
});

export const combineAndSortData = (salesData, expenseData) => {
  const salesEntries =
    salesData?.salesByMonth.flatMap((monthData) =>
      monthData.sales.map((sale) => ({
        name: sale.packageName,
        type: "sales",
        date: new Date(sale.date),
        amount: `+$${sale.amount}`,
      }))
    ) || [];
  const expenseEntries =
    expenseData?.expensesByMonth.flatMap((monthData) =>
      monthData.expenses.map((expense) => ({
        name: expense.category,
        type: "expense",
        date: new Date(expense.date),
        amount: ` -$${expense.amount} `,
      }))
    ) || [];

  const combinedEntries = [...salesEntries, ...expenseEntries].sort(
    (a, b) => b.date - a.date
  );

  return combinedEntries.slice(0, 6).map((entry) => ({
    ...entry,
    date: entry.date.toLocaleString(),
  }));
};

export const getTopPackages = (salesData) => {
  // Create a map to aggregate data by services
  const servicesMap = new Map();

  salesData?.sales?.forEach((sale) => {
    const { services, amount } = sale;

    services.forEach((service) => {
      if (servicesMap.has(service)) {
        const existingService = servicesMap.get(service);
        existingService.sold += 1;
        existingService.amount += amount;
      } else {
        servicesMap.set(service, { name: service, sold: 1, amount });
      }
    });
  });

  // Convert the map to an array and sort by sold count in descending order
  const sortedServices = Array.from(servicesMap.values()).sort(
    (a, b) => b.sold - a.sold
  );

  // Return the top services
  return sortedServices;
};

const notificationRoutes = {
  NEW_LEAD_ADDED: (id) => id ? `/leads/all-leads/${id}` : "/leads",
  LEAD_ASSIGNED: (id) => id ? `/sales-dashboard/${id}` : "/sales-dashboard",
  MESSAGE_RECEIVED: (id) => id ? `/messages/${id}` : "/messages",
  NEW_SALE_CREATED: (id) => id ? `/sales/all-sales/${id}` : "/sales/all-sales",
  SALE_UPDATED: (id) => id ? `/sales/all-sales/${id}` : "/sales/all-sales",
};

export const getNotificationLink = (type, id) => {
  return notificationRoutes[type] ? notificationRoutes[type](id) : "/dashboard"; // Default route
};

export function formatFileSize(bytes) {
  if (!bytes) return '0 Bytes';
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(1)) + ' ' + sizes[i];
}

export function getReadableFileType(mimeType) {
  const map = {
    'application/pdf': 'PDF',
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'application/vnd.ms-excel': 'XLS',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
    'image/jpeg': 'JPG',
    'image/png': 'PNG',
    'text/plain': 'TXT',
    // Add more as needed
  };

  return map[mimeType] || mimeType.split('/').pop().toUpperCase();
}


// export const getTopPackages = (salesData) => {
//   // Create a map to aggregate data by packageName
//   const packageMap = new Map();

//   salesData?.sales?.forEach((sale) => {
//     const { packageName, amount } = sale;

//     if (packageMap.has(packageName)) {
//       const existingPackage = packageMap.get(packageName);
//       existingPackage.sold += 1;
//       existingPackage.amount += amount;
//     } else {
//       packageMap.set(packageName, { name: packageName, sold: 1, amount });
//     }
//   });

//   // Convert the map to an array and sort by sold count in descending order
//   const sortedPackages = Array.from(packageMap.values()).sort(
//     (a, b) => b.sold - a.sold
//   );

//   // Return the top packages
//   return sortedPackages;
// };

export const getStatusColor = (status, endDate) => {
  // Check if endDate exists
  const isExpired = endDate ? new Date() > new Date(endDate) : false;

  if (status === "FollowUp" && isExpired) {
    return "#dc2626"; // Red for expired FollowUp
  }

  switch (status) {
    case "New":
      return "#730114"; // Blue
    case "Assigned":
      return "##730114"; // Blue
    case "FollowUp":
      return "#7301f4"; // Purple
    case "Converted":
      return "#16a34a"; // Green
    case "Lost":
      return "#dc2626"; // Red
    case "Contacted":
      return "#0891b2"; // Cyan
    case "Invalid":
      return "#6b7280"; // Yellow
    case "Qualified":
      return "#d97706"; // Amber
    default:
      return "#ca8a04"; // Gray
  }
};



export const downloadFile = async (url, filename) => {
  try {
    const response = await fetch(url);

    // Check if the fetch was successful
    if (!response.ok) {
      throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
    }

    // Convert the response to a blob
    const blob = await response.blob();

    // Create a blob URL
    const blobUrl = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;

    // Append to body, click the link, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the blob URL
    setTimeout(() => URL.revokeObjectURL(blobUrl), 100);

  } catch (error) {
    console.error("Download failed:", error);
    throw error;
  }
};
