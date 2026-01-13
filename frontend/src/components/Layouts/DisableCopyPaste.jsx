// import { useEffect } from "react";

// const DisableCopyPaste = () => {
//   useEffect(() => {
//     const handleCopyCut = (e: ClipboardEvent) => {
//       e.preventDefault();
//       alert("Copy/Cut is disabled on this website.");
//     };

//     const handleRightClick = (e: MouseEvent) => {
//       e.preventDefault();
//       alert("Right-click is disabled on this website.");
//     };

//     document.addEventListener("copy", handleCopyCut);
//     document.addEventListener("cut", handleCopyCut);
//     document.addEventListener("contextmenu", handleRightClick);

//     return () => {
//       document.removeEventListener("copy", handleCopyCut);
//       document.removeEventListener("cut", handleCopyCut);
//       document.removeEventListener("contextmenu", handleRightClick);
//     };
//   }, []);

//   return null;
// };

// export default DisableCopyPaste;




import { useEffect } from "react";

const DisableCopyPaste = ({ selector = '.protected-content', userRole }) => {
  useEffect(() => {
    if (userRole === 'admin' || userRole === 'superAdmin') return;
    const handleCopyCut = (e) => {
      // Check if the target element or its parent has the protected class
      if (e.target.closest(selector)) {
        e.preventDefault();
      }
    };


    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'a') {
        const target = e.target.closest(selector);
        if (target) {
          e.preventDefault();
        }
      }
    };

    document.addEventListener("copy", handleCopyCut);
    document.addEventListener("cut", handleCopyCut);
    document.addEventListener("keydown", handleKeyDown);


    return () => {
      document.removeEventListener("copy", handleCopyCut);
      document.removeEventListener("cut", handleCopyCut);
      document.removeEventListener("keydown", handleKeyDown);

    };
  }, [selector, userRole]);

  return null;
};

export default DisableCopyPaste;





// import { useEffect } from "react";

// const DisableCopyPaste = () => {
//   useEffect(() => {
//     const handleCopyCut = (e) => {
//       e.preventDefault();
//     //   al  ert("Copy/Cut is disabled on this website.");
//     };

//     // const handleRightClick = (e) => {
//     //   e.preventDefault();
//     //   alert("Right-click is disabled on this website.");
//     // };

//     document.addEventListener("copy", handleCopyCut);
//     document.addEventListener("cut", handleCopyCut);
//     // document.addEventListener("contextmenu", handleRightClick);

//     return () => {
//       document.removeEventListener("copy", handleCopyCut);
//       document.removeEventListener("cut", handleCopyCut);
//     //   document.removeEventListener("contextmenu", handleRightClick);
//     };
//   }, []);

//   return null;
// };

// export default DisableCopyPaste;
