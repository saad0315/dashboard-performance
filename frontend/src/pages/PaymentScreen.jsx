// import React, { useEffect, useState } from "react";
// import { fontSizes } from "../constants/colors";
// import { useSelector, useDispatch } from "react-redux";
// import { getPackages } from "../Redux/actions/packageAction";
// import PackageCards from "../components/PackagesCards/PackageCards";
// import LoadingSpinner from "../components/Loader/Loader";
// import { PrimaryHeading } from "../components/comp/HeroHeading/HeroHeading";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";
// import { ConfigProvider, Tabs } from "antd";
// import CustomizePackageCard from "../components/CustomizePackageCard/CustomizePackageCard";
// import CustomizeDesignPackage from "../components/CustomizeDesignPackage/CustomizeDesignPackage";
// import CustomizeWritingPackage from "../components/CustomizeWritingPackages/CustomizeWritingPackage";

// export default function Packages() {
//   const dispatch = useDispatch();
//   const { packages, loading } = useSelector((state) => state.package);
// const [activeTab, setActiveTab] = useState("All");

//   const { token } = useSelector((state) => state.user);
//   useEffect(() => {
//     dispatch(getPackages(token));
//   }, [dispatch, token]);

// const filteredPackages =
//   activeTab === "All"
//     ? packages
//     : packages?.filter((item) => item?.packageType === activeTab);

//   const NextArrow = (props) => (
//     <div style={{ display: "block", zIndex: 10 }}>
//       <GrLinkNext
//         style={{ fontSize: "24px", color: "#2CB9A8", cursor: "pointer" }}
//         {...props}
//       />
//     </div>
//   );

//   const PrevArrow = (props) => (
//     <div
//       className="!text-[#2CB9A8] bg-red-900"
//       style={{ display: "block", zIndex: 10 }}
//     >
//       <GrLinkPrevious
//         style={{ fontSize: "24px", cursor: "pointer" }}
//         {...props}
//       />
//     </div>
//   );

//   const showSlides = activeTab === "All" || activeTab === "Publishing" ? 3 : 2;

//   const settings = {
//     dots: false,
//     infinite: true,
//     speed: 500,
//     slidesToShow: showSlides,
//     slidesToScroll: 1,
//     nextArrow: <NextArrow />,
//     prevArrow: <PrevArrow />,
//     responsive: [
//       {
//         breakpoint: 1024,
//         settings: {
//           slidesToShow: 1,
//           slidesToScroll: 1,
//           nextArrow: <NextArrow />,
//           prevArrow: <PrevArrow />,
//         },
//       },
//       {
//         breakpoint: 500,
//         settings: {
//           slidesToShow: 1,
//           slidesToScroll: 1,
//           nextArrow: <></>,
//           prevArrow: <></>,
//         },
//       },
//     ],
//   };

//   return (
//     <div>
//       <div>
//         <PrimaryHeading>
//           Packages
//           <span className={`text-[#2CB9A8]  font-bold   ${fontSizes.text_xl}`}>
//             .
//           </span>
//         </PrimaryHeading>
//       </div>
// <div className="bg-white rounded-[20px] shadow-xl md:px-5 py-1">
//   <ConfigProvider
//     theme={{
//       components: {
//         Tabs: {
//           itemSelectedColor: "#2CB9A8",
//           itemHoverColor: "#2CB9A8",
//         },
//       },
//     }}
//   >
//     <Tabs
//       className="select-none"
//       itemHoverColor="rgba(0,0,0,0.88)"
//       defaultActiveKey="All"
//       type="card"
//       items={[
//         {
//           label: "All",
//           key: "All",
//         },
//         {
//           label: "Marketing",
//           key: "Marketing",
//         },
//         {
//           label: "Publishing",
//           key: "Publishing",
//         },
//         {
//           label: "Designing",
//           key: "Designing",
//         },
//         {
//           label: "Writing & Editing",
//           key: "Writing & Editing",
//         },
//       ]}
//       onChange={(key) => {
//         setActiveTab(key);
//       }}
//     />
//   </ConfigProvider>

// {loading ? (
//   <div className="h-[80vh] flex items-center justify-center">
//     <LoadingSpinner text={"Please Wait..."} />
//   </div>
// ) : (
//           <>
//             <div className="grid grid-cols-3">
// {activeTab && activeTab === "Marketing" && (
//   <div className=" col-span-3 lg:col-span-1 px-5 pt-3">
//     <CustomizePackageCard />
//   </div>
// )}
// {activeTab && activeTab === "Designing" && (
//   <div className="col-span-3 lg:col-span-1 px-5 pt-3">
//     <CustomizeDesignPackage />
//   </div>
// )}
// {activeTab && activeTab === "Writing & Editing" && (
//   <div className="col-span-3 lg:col-span-1 px-5 pt-3">
//     <CustomizeWritingPackage />
//   </div>
// )}

//               {filteredPackages && filteredPackages.length > 0 && (
//                 <div
//                   className={`w-full md:px-10
//                  ${
//                    activeTab === "All" || activeTab === "Publishing"
//                      ? "col-span-3"
//                      : "col-span-3 lg:col-span-2"
//                  }
//                  pt-3`}
//                 >
//                   <Slider {...settings}>
//                     {filteredPackages?.map((item, index) => (
//                       <div key={index} className="px-4">
//                         <PackageCards details={item} />
//                       </div>
//                     ))}
//                   </Slider>
//                 </div>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

import { Tab } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import React, { Fragment, useEffect, useState } from 'react';
import { getPackages } from '../../apis/packagesApi';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedPackage } from '../../store/packageSlice';
import { NavLink, useNavigate } from 'react-router-dom';
import IconCaretDown from '../../components/Icon/IconShoppingCart';
import IconDollarSign from '../../components/Icon/IconDollarSign';
import IconCreditCard from '../../components/Icon/IconCashBanknotes';
import PaymentForm from '../../components/Forms/PaymentForm/PaymentForm';
import Error500 from '../../components/ResultsComponents/Error500';
export default function PaymentScreen() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        isLoading,
        data: packageData,
        status,
    } = useQuery({
        queryKey: ['packages'],
        queryFn: getPackages,
    });

    const [activeTab, setActiveTab] = useState('All');
    const [activeTab3, setActiveTab3] = useState(1);
    const filteredPackages = activeTab === 'All' ? packageData?.packages : packageData?.packages?.filter((item) => item?.packageType === activeTab);
    const { selectedPackage } = useSelector((state) => state.package);
    const tabs = ['All', 'Marketing', 'Publishing', 'Designing', 'Writing & Editing'];
    return (
        <div>
            <div className="inline-block w-full">
                <div className="relative z-[1] mx-auto mt-10 ">
                    <div
                        className={`${activeTab3 === 1 ? 'w-[15%]' : activeTab3 === 2 ? 'w-[48%]' : activeTab3 === 3 ? 'w-[81%]' : ''}
                bg-primary w-[15%] h-1 absolute ltr:left-0 rtl:right-0 top-[30px] m-auto -z-[1] transition-[width]`}
                    ></div>
                    <ul className="mb-5 grid grid-cols-3 ">
                        <li className="mx-auto">
                            <button
                                type="button"
                                className={`${activeTab3 === 1 ? '!border-primary !bg-primary text-white' : ''}
                bg-white dark:bg-[#253b5c] border-[3px] border-[#f3f2ee] dark:border-[#1b2e4b] flex justify-center items-center w-16 h-16 rounded-full`}
                                onClick={() => setActiveTab3(1)}
                            >
                                <IconCaretDown />
                            </button>
                        </li>
                        <li className="mx-auto">
                            <button
                                type="button"
                                className={`${activeTab3 === 2 ? '!border-primary !bg-primary text-white' : ''}
                bg-white dark:bg-[#253b5c] border-[3px] border-[#f3f2ee] dark:border-[#1b2e4b] flex justify-center items-center w-16 h-16 rounded-full`}
                                onClick={() => setActiveTab3(2)}
                            >
                                <IconDollarSign />
                            </button>
                        </li>
                        <li className="mx-auto">
                            <button
                                type="button"
                                className={`${activeTab3 === 3 ? '!border-primary !bg-primary text-white' : ''}
                bg-white dark:bg-[#253b5c] border-[3px] border-[#f3f2ee] dark:border-[#1b2e4b] flex justify-center items-center w-16 h-16 rounded-full`}
                                onClick={() => setActiveTab3(3)}
                            >
                                <IconCreditCard />
                            </button>
                        </li>
                    </ul>
                </div>
                <div>
                    <div className="mb-5 mt-14">
                        {activeTab3 === 1 && (
                            <div className="flex flex-col-reverse md:flex-row gap-10 relative mt-5">
                                <div className="flex-1">
                                    <div className="relative p-4 pt-14 lg:p-9 border border-white-light dark:border-[#1b2e4b] transition-all duration-300 rounded-t-md">
                                        <div className="absolute top-0 md:-top-[0px] inset-x-0 bg-primary text-white h-10 flex items-center justify-center text-base rounded-t-md">Most Popular</div>
                                        <div className="flex flex-col justify-between  h-full">
                                            <div>
                                                <h3 className="text-xl py-7 mb-5 font-semibold text-black dark:text-white-light">{selectedPackage?.packageName}</h3>
                                                <div className="my-7 p-2.5 text-center text-lg">
                                                    <strong className="text-primary text-xl lg:text-4xl">${selectedPackage?.price}</strong>
                                                </div>
                                                <div className="mb-6">
                                                    <strong className="text-black dark:text-white-light text-[15px]  mb-3 inline-block">Package Features</strong>
                                                    <ul className="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-x-5">
                                                        {selectedPackage?.services.map((service, index) => (
                                                            <li key={index}>{service}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                            <NavLink
                                                to={'/packages'}
                                                type="button"
                                                className="btn btn-primary w-full"
                                                onClick={() => {
                                                    dispatch(setSelectedPackage(null));
                                                    localStorage.removeItem('selectedPackage');
                                                }}
                                            >
                                                Remove Now
                                            </NavLink>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 panel h-full md:sticky md:top-24 border border-white-light dark:border-[#1b2e4b]">
                                    <h2 className={` text-2xl font-bold mb-4 text-black dark:text-white-light`}>Order Summary</h2>
                                    <div className="mb-4">
                                        <p className="text-gray-600  dark:text-white-light ">Items:</p>
                                        <p className={` text-base  font-medium`}>{selectedPackage?.packageName} </p>
                                    </div>
                                    <div className="border-t border-gray-300 py-4">
                                        <p className={`text-primary  text-base font-bold`}>Total:</p>
                                        <p className={` text-base font-medium`}>${selectedPackage?.price}</p>

                                        {/* {selectedPackage.installments &&
                                            selectedPackage.installments.length > 0 &&
                                            (planDetails.installments[0].status === 'Pending' || planDetails.installments[0].status === 'Partial') && (
                                                <>
                                                    <p className={`text-[#07ae98]  text-base font-bold`}>Amount Due:</p>
                                                    <p className={` text-base font-medium`}>${planDetails.price || planDetails.installments[0].amount}</p>
                                                </>
                                            )} */}
                                    </div>
                                    <div className=" md:mt-6">
                                        <button type="button" className="btn btn-primary w-full" onClick={() => setActiveTab3(2)}>
                                            Ready to Pay
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <p className="mb-5">
                        {activeTab3 === 2 && (
                            <div>
                                <PaymentForm />
                            </div>
                        )}
                    </p>
                    <p className="mb-5">
                        {activeTab3 === 3 && (
                            <div>
                                <Error500 />
                            </div>
                        )}
                    </p>
                </div>
                <div className="flex justify-between">
                    <button type="button" className={`btn btn-primary ${activeTab3 === 1 ? 'hidden' : ''}`} onClick={() => setActiveTab3(activeTab3 === 3 ? 2 : 1)}>
                        Back
                    </button>
                    <button type="button" className="btn btn-primary ltr:ml-auto rtl:mr-auto" onClick={() => setActiveTab3(activeTab3 === 1 ? 2 : 3)}>
                        {activeTab3 === 3 ? 'Finish' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
}
