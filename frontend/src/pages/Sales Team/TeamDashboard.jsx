// import React, { useState, Fragment } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Dialog, Transition } from "@headlessui/react";
// // import { getTeamById, assignUserToTeam, removeUserFromTeam } from "../../api/salesApi";
// import { getAllUsers, assignedTeam } from "../../api/userApi";
// // import { getTeamLeads } from "../../api/leadsApi";
// import IconPlus from "../../components/Icon/IconPlus";
// import IconUser from "../../components/Icon/IconUser";
// import IconX from "../../components/Icon/IconX";
// import IconUsersGroup from "../../components/Icon/IconUsersGroup";
// import IconTrashLines from "../../components/Icon/IconTrashLines";
// import { coloredToast } from "../../components/Alerts/SimpleAlert";
// import Tippy from "@tippyjs/react";
// import { getSalesTeam } from "../../api/salesApi";

// export default function TeamDashboard() {
//   const { teamId } = useParams();
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   const [addMemberModal, setAddMemberModal] = useState(false);
//   const [removeModal, setRemoveModal] = useState(false);
//   const [selectedMember, setSelectedMember] = useState(null);

//   // Queries
//     const { data: teamData, isLoading: teamLoading } = useQuery({
//       queryKey: ["team", teamId],
//       queryFn: () => getSalesTeam(teamId),
//     });

//   const { data: usersData } = useQuery({
//     queryKey: ["users"],
//     queryFn: getAllUsers,
//   });

//   //   const { data: leadsData, isLoading: leadsLoading } = useQuery({
//   //     queryKey: ["teamLeads", teamId],
//   //     queryFn: () => getTeamLeads(teamId),
//   //   });

//   // Mutations
//   const assignMutation = useMutation({
//     mutationFn: (data) => assignedTeam(data),  // ✅ pass directly
//     onSuccess: () => {
//       queryClient.invalidateQueries(["team", teamId]);
//       setAddMemberModal(false);
//       coloredToast("success", "Member added successfully");
//     },
//     onError: (error) => {
//       coloredToast("danger", error?.response?.data?.message || "Failed to add member");
//     },
//   });

//   //   const mutation = useMutation({
//   //     mutationKey: ["assignTeam"],
//   //     mutationFn: (data) => assignedTeam(data),
//   //     onSuccess: (response) => {
//   //       form.current.reset();
//   //       query.invalidateQueries("salesTeam");
//   //       setModal20(false);
//   //       coloredToast(
//   //         "success",
//   //         "Team Has been Updated Successfully",
//   //         "top",
//   //         null,
//   //         null,
//   //         15000
//   //       );
//   //     },
//   //     onError: (error) => {
//   //       console.log(error);
//   //       coloredToast("danger", error?.response?.data?.message, "top");
//   //     },
//   //   });

//   //   const removeMutation = useMutation({
//   //     mutationFn: ({ userId, teamId }) => removeUserFromTeam({ userId, teamId }),
//   //     onSuccess: () => {
//   //       queryClient.invalidateQueries(["team", teamId]);
//   //       setRemoveModal(false);
//   //       coloredToast("success", "Member removed successfully");
//   //     },
//   //     onError: (error) => {
//   //       coloredToast("danger", error?.response?.data?.message || "Failed to remove member");
//   //     },
//   //   });

// const handleAddMember = (e) => {
//   e.preventDefault();
//   const formData = new FormData(e.target);

//   const payload = {
//     userId: formData.get('userId'),
//     teamAssignments: [
//       {
//         teamId: teamId,
//         role: formData.get('role') || 'member',
//         permissions: {
//           canViewLeads: formData.get('canViewLeads') === 'on',
//           canAssignLeads: formData.get('canAssignLeads') === 'on',
//           canEditLeads: formData.get('canEditLeads') === 'on',
//           canDeleteLeads: formData.get('canDeleteLeads') === 'on',
//         },
//       }
//     ]
//   };

//   assignMutation.mutate(payload);
// };


//   //   if (teamLoading) return <div>Loading...</div>;
//   console.log("teamData", teamData);
//   const team = teamData || [];
//   const leads = [];

//   // Get available users (not already in team)
//   const availableUsers = usersData?.users?.filter(user =>
//     !team?.members?.some(member => member?.user?._id === user?._id)
//   ) || [];

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <ul className="flex space-x-2 rtl:space-x-reverse">
//             <li>
//               <Link to="/sales-managers" className="text-primary hover:underline">
//                 Teams
//               </Link>
//             </li>
//             <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
//               <span>{team?.teamName}</span>
//             </li>
//           </ul>
//           <h1 className="text-3xl font-bold mt-2">{team?.teamName}</h1>
//           <p className="text-gray-600 dark:text-gray-400">
//             {team?.department} Department • {team?.members?.length || 0} Members
//           </p>
//         </div>

//         <div className="flex gap-2">
//           <Tippy content="Add Member">
//             <button
//               onClick={() => setAddMemberModal(true)}
//               className="btn btn-primary"
//             >
//               <IconPlus className="w-4 h-4 mr-2" />
//               Add Member
//             </button>
//           </Tippy>
//         </div>
//       </div>

//       {/* Team Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <div className="panel">
//           <div className="flex items-center">
//             <div className="ltr:mr-3 rtl:ml-3 text-primary">
//               <IconUsersGroup className="w-6 h-6" />
//             </div>
//             <div>
//               <div className="text-xl font-semibold text-primary">
//                 {team?.members?.length || 0}
//               </div>
//               <div className="text-gray-600 dark:text-gray-400">Total Members</div>
//             </div>
//           </div>
//         </div>

//         <div className="panel">
//           <div className="flex items-center">
//             <div className="ltr:mr-3 rtl:ml-3 text-success">
//               <IconUser className="w-6 h-6" />
//             </div>
//             <div>
//               <div className="text-xl font-semibold text-success">
//                 {leads?.filter(lead => lead.status === 'New').length || 0}
//               </div>
//               <div className="text-gray-600 dark:text-gray-400">New Leads</div>
//             </div>
//           </div>
//         </div>

//         <div className="panel">
//           <div className="flex items-center">
//             <div className="ltr:mr-3 rtl:ml-3 text-warning">
//               <IconUser className="w-6 h-6" />
//             </div>
//             <div>
//               <div className="text-xl font-semibold text-warning">
//                 {leads?.filter(lead => lead.status === 'Contacted').length || 0}
//               </div>
//               <div className="text-gray-600 dark:text-gray-400">In Progress</div>
//             </div>
//           </div>
//         </div>

//         <div className="panel">
//           <div className="flex items-center">
//             <div className="ltr:mr-3 rtl:ml-3 text-info">
//               <IconUser className="w-6 h-6" />
//             </div>
//             <div>
//               <div className="text-xl font-semibold text-info">
//                 {leads?.filter(lead => lead.status === 'Converted').length || 0}
//               </div>
//               <div className="text-gray-600 dark:text-gray-400">Converted</div>
//             </div>
//           </div>
//         </div>
//       </div>


//       {/* Team Members */}
//       <div className="panel">
//         <div className="flex items-center justify-between mb-5">
//           <h5 className="font-semibold text-lg">Team Members</h5>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {/* {team?.members?.map((member) => (
//             <div key={member.user._id} className="relative p-4 rounded-lg border border-gray-200 dark:border-gray-700">
//               <div className="flex items-center space-x-3">
//                 <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
//                   <span className="text-primary font-semibold">
//                     {member.user.userName?.charAt(0).toUpperCase()}
//                   </span>
//                 </div>
//                 <div className="flex-1">
//                   <h6 className="font-semibold">{member.user.userName}</h6>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">
//                     {member.user.userEmail}
//                   </p>
//                   <div className="flex gap-1 mt-1">
//                     <span className={`text-xs px-2 py-1 rounded-full ${member.role === 'manager'
//                       ? 'bg-primary/10 text-primary'
//                       : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
//                       }`}>
//                       {member.role}
//                     </span>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setSelectedMember(member);
//                     setRemoveModal(true);
//                   }}
//                   className="text-danger hover:bg-danger/10 p-2 rounded"
//                 >
//                   <IconTrashLines className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           ))} */}
//         </div>
//       </div>

//       {/* Add Member Modal */}
//       <Transition appear show={addMemberModal} as={Fragment}>
//         <Dialog as="div" open={addMemberModal} onClose={() => setAddMemberModal(false)}>
//           <div className="fixed inset-0 bg-black/60 z-[999] overflow-y-auto">
//             <div className="flex items-start justify-center min-h-screen px-4">
//               <Dialog.Panel className="panel border-0 py-1 px-4 rounded-lg overflow-hidden w-full max-w-md my-8">
//                 <div className="flex items-center justify-between p-5 font-semibold text-lg">
//                   <h5>Add Team Member</h5>
//                   <button onClick={() => setAddMemberModal(false)}>
//                     <IconX />
//                   </button>
//                 </div>

//                 <form onSubmit={handleAddMember} className="p-5 pt-0 space-y-4">
//                   <div>
//                     <label className="font-medium">Select User</label>
//                     <select name="userId" required className="form-select">
//                       <option value="">Choose user...</option>
//                       {availableUsers.map(user => (
//                         <option key={user._id} value={user._id}>
//                           {user.userName} ({user.userEmail})
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="font-medium">Role</label>
//                     <select name="role" className="form-select">
//                       <option value="member">Member</option>
//                       <option value="manager">Manager</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="font-medium">Permissions</label>
//                     <div className="space-y-2 mt-2">
//                       <label className="flex items-center">
//                         <input type="checkbox" name="canViewLeads" defaultChecked className="form-checkbox" />
//                         <span className="ml-2">Can View Leads</span>
//                       </label>
//                       <label className="flex items-center">
//                         <input type="checkbox" name="canEditLeads" defaultChecked className="form-checkbox" />
//                         <span className="ml-2">Can Edit Leads</span>
//                       </label>
//                       <label className="flex items-center">
//                         <input type="checkbox" name="canAssignLeads" className="form-checkbox" />
//                         {/* <span className=" */}
//                         <span className="ml-2">Can Assign Leads</span>
//                       </label>
//                       <label className="flex items-center">
//                         <input type="checkbox" name="canDeleteLeads" className="form-checkbox" />
//                         <span className="ml-2">Can Delete Leads</span>
//                       </label>
//                     </div>
//                   </div>
//                   <div className="flex justify-end">
//                     <button type="submit" className="btn btn-primary">
//                       Add Member
//                     </button>
//                   </div>
//                 </form>
//               </Dialog.Panel>
//             </div>
//           </div>
//         </Dialog>
//       </Transition>
//     </div>
//   );
// }


import React, { useState, Fragment } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, Transition } from "@headlessui/react";
import { getAllUsers, assignedTeam } from "../../api/userApi";
import { getTeamPerformanceWithUsers } from "../../api/performanceApi";
import IconPlus from "../../components/Icon/IconPlus";
import IconX from "../../components/Icon/IconX";
import { coloredToast } from "../../components/Alerts/SimpleAlert";
import Tippy from "@tippyjs/react";

/* ------------------------ small helpers ------------------------ */
const currency = (n) =>
  (n ?? 0).toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const percent = (n) =>
  `${(n ?? 0).toFixed(2)}%`;

/* simple shimmering skeleton */
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-slate-200/70 dark:bg-slate-700/40 rounded-lg ${className}`} />
);

/* stat card */
const StatCard = ({
  title,
  value,
  trend,
  icon,
  accent = "from-primary/20 to-primary/5",
}) => (
  <div className={`relative overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-700/50
    bg-white/70 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-all`}>
    <div className={`absolute inset-0 bg-gradient-to-br ${accent}`} />
    <div className="relative p-5 sm:p-6 flex items-start gap-4">
      <div className="shrink-0 rounded-xl p-3 bg-white/70 dark:bg-slate-800/70 shadow ring-1 ring-slate-200/60 dark:ring-slate-700">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium tracking-wide text-slate-500 dark:text-slate-400 uppercase">{title}</p>
        <p className="mt-1 text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">{value}</p>
        {trend && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{trend}</p>}
      </div>
    </div>
  </div>
);

/* member card */
const MemberCard = ({ perf }) => {
  const role =
    perf?.user?.designation?.toLowerCase().includes("manager") ? "Manager" : "Member";

  return (
    <Link
      to={`/sales-persons/${perf.user._id}`}
      className="group relative rounded-2xl border border-slate-200/70 dark:border-slate-700/50
      bg-white/70 dark:bg-slate-900/40 backdrop-blur-sm p-5 sm:p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5
      transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{perf.user.userName}</h4>
          <span className="inline-flex mt-1 items-center rounded-full border border-slate-200 dark:border-slate-700
            px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
            {role}
          </span>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">View ➜</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-slate-50/90 dark:bg-slate-800/50 p-3">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Leads Assigned</p>
          <p className="font-semibold">{perf.leadsAssigned ?? 0}</p>
        </div>
        <div className="rounded-xl bg-slate-50/90 dark:bg-slate-800/50 p-3">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Total Deals</p>
          <p className="font-semibold">{perf.totalDeals ?? 0}</p>
        </div>
        <div className="rounded-xl bg-slate-50/90 dark:bg-slate-800/50 p-3">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Revenue</p>
          <p className="font-semibold">{currency(perf.totalSales)}</p>
        </div>
        <div className="rounded-xl bg-slate-50/90 dark:bg-slate-800/50 p-3">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Conversion</p>
          <p className="font-semibold">{percent(perf.conversionRate)}</p>
        </div>
      </div>
    </Link>
  );
};

export default function TeamDashboard() {
  const { teamId } = useParams();
  const queryClient = useQueryClient();
  const [addMemberModal, setAddMemberModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const { data: usersData } = useQuery({ queryKey: ["users"], queryFn: getAllUsers });
  const { data: teamData, isLoading: performanceLoading } = useQuery({
    queryKey: ["teamPerformance", teamId, selectedMonth],
    queryFn: () => getTeamPerformanceWithUsers(teamId, selectedMonth),
  });

  const assignMutation = useMutation({
    mutationFn: (data) => assignedTeam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamPerformance", teamId, selectedMonth] });
      setAddMemberModal(false);
      coloredToast("success", "Member added successfully");
    },
    onError: (error) => {
      coloredToast("danger", error?.response?.data?.message || "Failed to add member");
    },
  });

  const handleAddMember = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      userId: formData.get("userId"),
      teamAssignments: [
        {
          teamId: teamId,
          role: formData.get("role") || "member",
          permissions: {
            canViewLeads: formData.get("canViewLeads") === "on",
            canAssignLeads: formData.get("canAssignLeads") === "on",
            canEditLeads: formData.get("canEditLeads") === "on",
            canDeleteLeads: formData.get("canDeleteLeads") === "on",
          },
        },
      ],
    };
    assignMutation.mutate(payload);
  };

  const team = teamData || {};
  const availableUsers =
    usersData?.users?.filter(
      (user) => !team?.members?.some((member) => member?.user?._id === user?._id)
    ) || [];

  const handleMonthChange = (e) => {
    const value = e.target.value;
    if (!value) setSelectedMonth(null);
    else {
      const [year, month] = value.split("-");
      setSelectedMonth({ year: parseInt(year), month: parseInt(month) });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 dark:border-slate-700/50
          bg-gradient-to-br from-rose-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900
          p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <ul className="flex space-x-2 rtl:space-x-reverse text-sm">
              <li>
                <Link to="/sales-managers" className="text-primary hover:underline">Teams</Link>
              </li>
              <li className="before:content-['/'] ltr:before:mx-2 rtl:before:mx-2 text-slate-400">
                <span>{teamData?.team?.teamName || "—"}</span>
              </li>
            </ul>
            <h1 className="text-3xl sm:text-4xl font-bold mt-2 tracking-tight text-slate-900 dark:text-white">
              {teamData?.team?.teamName || "Team"}
            </h1>
            <p className="mt-1 text-slate-600 dark:text-slate-300 capitalize">
              {teamData?.team?.department} Department • {teamData?.totalMembers} Members
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200/70 dark:border-slate-700/60
                bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm px-3 py-2">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Month</label>
              <input
                type="month"
                className="form-input border-0 bg-transparent focus:ring-0 text-sm"
                value={
                  selectedMonth
                    ? `${selectedMonth.year}-${String(selectedMonth.month).padStart(2, "0")}`
                    : ""
                }
                onChange={handleMonthChange}
              />
            </div>

            <Tippy content="Add Member">
              <button
                onClick={() => setAddMemberModal(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary
                px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary
                focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <IconPlus className="w-4 h-4" />
                Add Member
              </button>
            </Tippy>
          </div>
        </div>
      </div>

      {/* Stats */}
      {performanceLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard
            title="Leads Assigned"
            value={teamData?.teamTotals?.leadsAssigned ?? 0}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 7a5 5 0 1110 0v2h1a3 3 0 013 3v7h-4v-6h-2v6H5v-7a3 3 0 013-3h1V7z" />
              </svg>
            }
            accent="from-primary/15 to-primary/0"
          />
          <StatCard
            title="Total Deals"
            value={teamData?.teamTotals?.totalDeals ?? 0}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4 2 2-6 6-4-4 2-2z" />
              </svg>
            }
            accent="from-emerald-500/15 to-emerald-500/0"
          />
          <StatCard
            title="Revenue"
            value={currency(teamData?.teamTotals?.totalSales)}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1.75a.75.75 0 01.75.75V4h1.5a3.75 3.75 0 110 7.5h-5a2.25 2.25 0 100 4.5h5.75a.75.75 0 010 1.5H12v1.5a.75.75 0 01-1.5 0V17H9a3.75 3.75 0 110-7.5h5a2.25 2.25 0 100-4.5H8.25a.75.75 0 010-1.5H10V2.5a.75.75 0 01.75-.75z" />
              </svg>
            }
            accent="from-sky-500/15 to-sky-500/0"
          />
          <StatCard
            title="Conversion Rate"
            value={percent(teamData?.teamTotals?.conversionRate)}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3v6h-2V6.41l-5.29 5.3-2.82-2.83L4 13.76V11H2v6h6v-2H5.41l4.47-4.47 2.83 2.82L18 8.41V11h2V3h-1z" />
              </svg>
            }
            accent="from-amber-500/15 to-amber-500/0"
          />
        </div>
      )}

      {/* Members */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Team Members</h3>
          {teamData?.totalMembers ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {teamData?.totalMembers} people
            </p>
          ) : null}
        </div>

        {performanceLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        ) : teamData?.memberPerformances?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* {teamData.memberPerformances.map((perf) => ( */}
            {teamData.memberPerformances
              ?.slice() // copy array so original na change ho
              .sort((a, b) => {
                const isManagerA = a?.user?.designation?.toLowerCase().includes("manager");
                const isManagerB = b?.user?.designation?.toLowerCase().includes("manager");

                if (isManagerA && !isManagerB) return -1; // a manager -> pehle
                if (!isManagerA && isManagerB) return 1;  // b manager -> baad me
                return 0; // dono same -> order maintain
              })
              .map((perf) => (
                <MemberCard key={perf.user._id} perf={perf} />
              ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-10 text-center">
            <p className="text-slate-600 dark:text-slate-300">No members yet.</p>
            <button
              onClick={() => setAddMemberModal(true)}
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2 text-sm font-medium hover:opacity-90"
            >
              <IconPlus className="w-4 h-4" />
              Add first member
            </button>
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      <Transition appear show={addMemberModal} as={Fragment}>
        <Dialog as="div" open={addMemberModal} onClose={() => setAddMemberModal(false)}>
          <div className="fixed inset-0 bg-black/50 z-[999] backdrop-blur-sm overflow-y-auto">
            <div className="flex items-start justify-center min-h-screen px-4">
              <Dialog.Panel className="w-full max-w-md my-10 overflow-hidden rounded-3xl
                  bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/60 shadow-xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/70 dark:border-slate-700/60">
                  <h5 className="text-lg font-semibold capitalize dark:text-slate-200 ">Add Team Member</h5>
                  <button onClick={() => setAddMemberModal(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                    <IconX />
                  </button>
                </div>

                <form onSubmit={handleAddMember} className="px-6 py-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-slate-200">Select User</label>
                    <select name="userId" required className="form-select rounded-xl">
                      <option value="">Choose user...</option>
                      {availableUsers.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.userName} ({user.userEmail})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-slate-200">Role</label>
                    <select name="role" className="form-select rounded-xl">
                      <option value="member">Member</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setAddMemberModal(false)}
                      className="rounded-xl px-4 py-2 text-sm font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary rounded-xl px-4 py-2 text-sm font-semibold"
                    >
                      Add Member
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}


// import React, { useState, Fragment } from "react";
// import { useParams, Link } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Dialog, Transition } from "@headlessui/react";
// import { getAllUsers, assignedTeam } from "../../api/userApi";
// import { getTeamPerformanceWithUsers } from "../../api/performanceApi";
// import IconPlus from "../../components/Icon/IconPlus";
// import IconX from "../../components/Icon/IconX";
// import { coloredToast } from "../../components/Alerts/SimpleAlert";
// import Tippy from "@tippyjs/react";
// export default function TeamDashboard() {
//   const { teamId } = useParams();
//   const queryClient = useQueryClient();
//   const [addMemberModal, setAddMemberModal] = useState(false);
//   const [selectedMonth, setSelectedMonth] = useState(null);
//   // const { data: teamData } = useQuery({
//   //   queryKey: ["team", teamId],
//   //   queryFn: () => getSalesTeam(teamId),
//   // });
//   const { data: usersData } = useQuery({
//     queryKey: ["users"],
//     queryFn: getAllUsers,
//   });
//   const { data: teamData, isLoading: performanceLoading } = useQuery({
//     queryKey: ["teamPerformance", teamId, selectedMonth],
//     queryFn: () => getTeamPerformanceWithUsers(teamId, selectedMonth),
//   });
//   const assignMutation = useMutation({
//     mutationFn: (data) => assignedTeam(data),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["team", teamId]);
//       setAddMemberModal(false);
//       coloredToast("success", "Member added successfully");
//     },
//     onError: (error) => {
//       coloredToast("danger", error?.response?.data?.message || "Failed to add member");
//     },
//   });
//   const handleAddMember = (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const payload = {
//       userId: formData.get("userId"),
//       teamAssignments: [
//         {
//           teamId: teamId,
//           role: formData.get("role") || "member",
//           permissions: {
//             canViewLeads: formData.get("canViewLeads") === "on",
//             canAssignLeads: formData.get("canAssignLeads") === "on",
//             canEditLeads: formData.get("canEditLeads") === "on",
//             canDeleteLeads: formData.get("canDeleteLeads") === "on",
//           },
//         },
//       ],
//     };
//     assignMutation.mutate(payload);
//   };
//   const team = teamData || {};
//   const availableUsers =
//     usersData?.users?.filter(
//       (user) => !team?.members?.some((member) => member?.user?._id === user?._id)
//     ) || [];


//   const handleMonthChange = (e) => {
//     const value = e.target.value;

//     if (!value) {
//       setSelectedMonth(null); // show all data if cleared
//     } else {
//       const [year, month] = value.split("-");
//       setSelectedMonth({
//         year: parseInt(year),
//         month: parseInt(month),
//       });
//     }
//   };
//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <ul className="flex space-x-2 rtl:space-x-reverse">
//             <li>
//               <Link to="/sales-managers" className="text-primary hover:underline">
//                 Teams
//               </Link>
//             </li>
//             <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
//               <span>{teamData?.team?.teamName}</span>
//             </li>
//           </ul>
//           <h1 className="text-3xl font-bold mt-2">{teamData?.team?.teamName}</h1>
//           <p className="text-gray-600 dark:text-gray-400 capitalize">
//             {teamData?.team?.department} Department • {teamData?.totalMembers} Members
//           </p>
//         </div>
//         <div className="flex gap-2 flex-col">
//           <Tippy content="Add Member">
//             <button onClick={() => setAddMemberModal(true)} className="btn btn-primary">
//               <IconPlus className="w-4 h-4 mr-2" />
//               Add Member
//             </button>
//           </Tippy>
//           <div className="mb-4 float-end">
//             <label className="font-semibold mr-2">Select Month:</label>
//             <input
//               type="month"
//               className="select form-input w-auto  "
//               // value={`${selectedMonth.year}-${String(selectedMonth.month).padStart(2, "0")}`} // Ensure two-digit month
//               value={
//                 selectedMonth
//                   ? `${selectedMonth.year}-${String(selectedMonth.month).padStart(2, "0")}`
//                   : ""
//               }
//               onChange={handleMonthChange}
//             />
//           </div>
//         </div>
//       </div>
//       {/* Month Selector */}


//       {/* Team Stats */}

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <div className="panel">
//           <div className="text-xl font-semibold text-primary">
//             {teamData?.teamTotals?.leadsAssigned || 0}
//           </div>
//           <div className="text-gray-600 dark:text-gray-400">Leads Assigned</div>
//         </div>
//         <div className="panel">
//           <div className="text-xl font-semibold text-success">
//             {teamData?.teamTotals?.leadsConverted || 0}
//           </div>
//           <div className="text-gray-600 dark:text-gray-400">Converted</div>
//         </div>
//         <div className="panel">
//           <div className="text-xl font-semibold text-info">
//             ${teamData?.teamTotals?.totalSales || 0}
//           </div>
//           <div className="text-gray-600 dark:text-gray-400">Revenue</div>
//         </div>
//         <div className="panel">
//           <div className="text-xl font-semibold text-warning">
//             {teamData?.teamTotals?.conversionRate?.toFixed(2) || 0}%
//           </div>
//           <div className="text-gray-600 dark:text-gray-400">Conversion Rate</div>
//         </div>
//       </div>

//       {/* Team Members with Performance */}
//       <div className="panel">
//         <h5 className="font-semibold text-lg mb-5">Team Members</h5>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {teamData?.memberPerformances?.map((perf) => (
//             <Link
//               to={`/sales-persons/${perf.user._id}`}
//               key={perf.user._id}
//               className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-900"
//             >
//               <h4 className="font-semibold text-lg">{perf.user.userName}</h4>
//               <p className="text-sm text-gray-500">{perf.user.designation}</p>
//               <ul className="mt-3 space-y-1 text-sm text-gray-700 dark:text-gray-300">
//                 <li>Leads Assigned: {perf.leadsAssigned}</li>
//                 <li>Converted: {perf.leadsConverted}</li>
//                 <li>Revenue: ${perf.totalSales}</li>
//                 <li>Conversion Rate: {perf.conversionRate?.toFixed(2)}%</li>
//               </ul>
//             </Link>
//           ))}
//         </div>
//       </div>
//       {/* Add Member Modal */}
//       <Transition appear show={addMemberModal} as={Fragment}>
//         <Dialog as="div" open={addMemberModal} onClose={() => setAddMemberModal(false)}>
//           <div className="fixed inset-0 bg-black/60 z-[999] overflow-y-auto">
//             <div className="flex items-start justify-center min-h-screen px-4">
//               <Dialog.Panel className="panel border-0 py-1 px-4 rounded-lg overflow-hidden w-full max-w-md my-8">
//                 <div className="flex items-center justify-between p-5 font-semibold text-lg">
//                   <h5>Add Team Member</h5>
//                   <button onClick={() => setAddMemberModal(false)}>
//                     <IconX />
//                   </button>
//                 </div>
//                 <form onSubmit={handleAddMember} className="p-5 pt-0 space-y-4">
//                   <div>
//                     <label className="font-medium">Select User</label>
//                     <select name="userId" required className="form-select">
//                       <option value="">Choose user...</option>
//                       {availableUsers.map((user) => (
//                         <option key={user._id} value={user._id}>
//                           {user.userName} ({user.userEmail})
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="font-medium">Role</label>
//                     <select name="role" className="form-select">
//                       <option value="member">Member</option>
//                       <option value="manager">Manager</option>
//                     </select>
//                   </div>
//                   {/* <div>
//                     <label className="font-medium">Permissions</label>
//                     <div className="space-y-2 mt-2">
//                       <label className="flex items-center">
//                         <input
//                           type="checkbox"
//                           name="canViewLeads"
//                           defaultChecked
//                           className="form-checkbox"
//                         />
//                         <span className="ml-2">Can View Leads</span>
//                       </label>
//                       <label className="flex items-center">
//                         <input
//                           type="checkbox"
//                           name="canEditLeads"
//                           defaultChecked
//                           className="form-checkbox"
//                         />
//                         <span className="ml-2">Can Edit Leads</span>
//                       </label>
//                       <label className="flex items-center">
//                         <input type="checkbox" name="canAssignLeads" className="form-checkbox" />
//                         <span className="ml-2">Can Assign Leads</span>
//                       </label>
//                       <label className="flex items-center">
//                         <input type="checkbox" name="canDeleteLeads" className="form-checkbox" />
//                         <span className="ml-2">Can Delete Leads</span>
//                       </label>
//                     </div>
//                   </div> */}
//                   <div className="flex justify-end">
//                     <button type="submit" className="btn btn-primary">
//                       Add Member
//                     </button>
//                   </div>
//                 </form>
//               </Dialog.Panel>
//             </div>
//           </div>
//         </Dialog>
//       </Transition>
//     </div>
//   );
// }