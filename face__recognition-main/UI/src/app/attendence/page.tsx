// "use client";
// import { BackgroundBeams } from "@/components/ui/background-beams";
// import { useAuth } from "@clerk/nextjs";
// import React, { useEffect, useState } from "react";
// import { MdAssignment, MdControlPointDuplicate } from "react-icons/md";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";

// // ⚠️ If running locally, change to "http://127.0.0.1:8080"
// const BACKEND_URL = "https://ubiquitous-xylophone-7q5grgx9wwpfx5qq-8080.app.github.dev";

// interface AttendancePageProps {
//   mess?: string;
//   l: number;
//   names: string[];
//   rolls: string[];
//   times: string[];
//   totalreg: number;
// }

// const AttendencePage: React.FC<AttendancePageProps> = ({
//   mess,
//   l,
//   names,
//   rolls,
//   times,
//   totalreg,
// }) => {
//   const [attendanceData, setAttendanceData] = useState({
//     names: names || [],
//     rolls: rolls || [],
//     times: times || [],
//     l: l || 0,
//   });

//   const [userCount, setUserCount] = useState(totalreg || 0);
//   const { userId } = useAuth();
//   const [isLoading, setIsLoading] = useState(false);

//   // --- GET ATTENDANCE ---
//   const handleAttendence = () => {
//     setIsLoading(true);
//     fetch(`${BACKEND_URL}/start`)
//       .then((response) => {
//         if (!response.ok) throw new Error(`Error: ${response.statusText}`);
//         return response.json();
//       })
//       .then((data) => {
//         if (data.mess) {
//           alert(data.mess); // Show error if model not trained
//         } else {
//           setAttendanceData({
//             names: data.names,
//             rolls: data.rolls,
//             times: data.times,
//             l: data.l,
//           });
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching attendance:", error);
//         alert("Failed to start attendance. Ensure Backend is running.");
//       })
//       .finally(() => setIsLoading(false));
//   };

//   // --- ADD USER ---
//   const handleAddUser = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setIsLoading(true);
//     const formData = new FormData(event.currentTarget);

//     try {
//       const response = await fetch(`${BACKEND_URL}/add`, {
//         method: "POST",
//         body: formData, // Sends 'newusername' and 'newuserid'
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || "Server rejected request");
//       }

//       if (result.success) {
//         setUserCount((prev) => prev + 1);
//         alert("User added successfully! Model trained.");
//         (event.target as HTMLFormElement).reset();
//       } else {
//         alert(`Failed: ${result.message}`);
//       }
//     } catch (error: any) {
//       console.error("Error adding user:", error);
//       alert(`Error: ${error.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       {userId ? (
//         <div className="text-center">
//           <h1 className="text-white p-3 text-4xl mt-[105px] md:mt-28 lg:mt-28">
//             Face Recognition System
//           </h1>

//           {mess && <p className="text-red-500 text-xl">{mess}</p>}
//           {isLoading && <p className="text-yellow-400 font-bold animate-pulse">Processing... Please wait...</p>}

//           <div className="flex justify-center space-x-4 p-5 m-5 flex-col-reverse md:flex-row lg:flex-row">
//             {/* Left Side: Attendance Table */}
//             <div className="bg-black bg-opacity-80 rounded-lg p-0 m-2 min-h-[400px] flex flex-col gap-5 flex-1">
//               <div className="flex items-center justify-center bg-white text-black rounded-md shadow-lg">
//                 <h2 className="p-2 font-bold">Today's Attendance</h2>
//                 <MdAssignment />
//               </div>
//               <div className="flex items-center justify-center rounded-md shadow-lg bg-blue-600 text-white">
//                 <button
//                   className="w-full h-10 font-medium hover:bg-blue-700 transition"
//                   onClick={handleAttendence}
//                   disabled={isLoading}
//                 >
//                   {isLoading ? "Camera Active..." : "Take Attendance"}
//                 </button>
//               </div>
//               <table className="bg-white w-full text-black rounded-md">
//                 <thead>
//                   <tr>
//                     <th className="px-4 py-2">S.No</th>
//                     <th className="px-4 py-2">Name</th>
//                     <th className="px-4 py-2">ID</th>
//                     <th className="px-4 py-2">Time</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {attendanceData.l > 0 ? (
//                     Array.from({ length: attendanceData.l }, (_, i) => (
//                       <tr key={i}>
//                         <td className="border px-4 py-2">{i + 1}</td>
//                         <td className="border px-4 py-2">{attendanceData.names[i]}</td>
//                         <td className="border px-4 py-2">{attendanceData.rolls[i]}</td>
//                         <td className="border px-4 py-2">{attendanceData.times[i]}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={4} className="p-4 text-center">No attendance marked yet</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* Right Side: Add User Form */}
//             <div className="bg-black bg-opacity-80 rounded-lg p-0 m-2 h-[400px] flex flex-col -mt-2 md:mt-2 lg:mt-2">
//               <form onSubmit={handleAddUser}>
//                 <div className="flex items-center justify-center bg-white text-black rounded-md shadow-lg">
//                   <h2 className="p-2 font-bold">Add New User</h2>
//                   <MdControlPointDuplicate className="h-5 w-5 font-bold" />
//                 </div>
//                 <div className="flex items-center justify-center flex-col gap-4 p-5">
//                   <div className="flex flex-col gap-2">
//                     <Label htmlFor="newusername" className="text-white text-lg">
//                       Enter Name*
//                     </Label>
//                     <Input
//                       type="text"
//                       id="newusername"
//                       name="newusername"
//                       className="text-black p-2 bg-slate-300 w-60"
//                       required
//                     />
//                   </div>
//                   <div className="flex flex-col gap-2">
//                     <Label htmlFor="newuserid" className="text-white text-lg">
//                       Enter ID No*
//                     </Label>
//                     <Input
//                       type="number"
//                       id="newuserid"
//                       name="newuserid"
//                       className="text-black p-2 bg-slate-300 w-60"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <button
//                   className="bg-white text-black w-full rounded-md h-10 font-medium mt-10 hover:bg-gray-200"
//                   type="submit"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? "Opening Camera..." : "Add New User →"}
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="p-4 relative z-10 text-center flex justify-center items-center h-screen w-full">
//           <BackgroundBeams />
//           <h1 className="mt-20 text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
//             Login Required
//           </h1>
//         </div>
//       )}
//     </>
//   );
// };

// export default AttendencePage;

// "use client";
// import { BackgroundBeams } from "@/components/ui/background-beams";
// import { useAuth } from "@clerk/nextjs";
// import React, { useEffect, useState, useRef } from "react";
// import { MdAssignment, MdControlPointDuplicate, MdCloudUpload } from "react-icons/md";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";

// // CHANGE THIS URL TO YOUR GITHUB CODESPACE URL
// const BACKEND_URL = "https://ubiquitous-xylophone-7q5grgx9wwpfx5qq-8080.app.github.dev";

// interface AttendancePageProps {
//   mess?: string;
//   l: number;
//   names: string[];
//   rolls: string[];
//   times: string[];
//   totalreg: number;
// }

// const AttendencePage: React.FC<AttendancePageProps> = ({
//   names,
//   rolls,
//   times,
//   l,
//   totalreg,
// }) => {
//   const [attendanceData, setAttendanceData] = useState({
//     names: names || [],
//     rolls: rolls || [],
//     times: times || [],
//     l: l || 0,
//   });

//   const [userCount, setUserCount] = useState(totalreg || 0);
//   const { userId } = useAuth();
//   const [isLoading, setIsLoading] = useState(false);
  
//   // Ref to trigger the hidden file input for "Take Attendance"
//   const attendanceFileInputRef = useRef<HTMLInputElement>(null);

//   // --- 1. TAKE ATTENDANCE (Upload Image) ---
//   const triggerAttendanceUpload = () => {
//     attendanceFileInputRef.current?.click();
//   };

//   const handleAttendanceUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (!event.target.files || event.target.files.length === 0) return;

//     setIsLoading(true);
//     const file = event.target.files[0];
//     const formData = new FormData();
//     formData.append("attendance_image", file);

//     try {
//       const response = await fetch(`${BACKEND_URL}/start`, {
//         method: "POST", // Changed to POST to send file
//         body: formData,
//       });

//       if (!response.ok) {
//         const err = await response.json();
//         throw new Error(err.message || "Server Error");
//       }

//       const data = await response.json();
      
//       if (data.mess) {
//          alert(data.mess);
//       } else {
//          setAttendanceData({
//            names: data.names,
//            rolls: data.rolls,
//            times: data.times,
//            l: data.l,
//          });
//          alert("Attendance Checked Successfully!");
//       }
//     } catch (error: any) {
//       console.error("Error taking attendance:", error);
//       alert(`Error: ${error.message}`);
//     } finally {
//       setIsLoading(false);
//       // Reset input so same file can be selected again if needed
//       if (attendanceFileInputRef.current) attendanceFileInputRef.current.value = "";
//     }
//   };

//   // --- 2. ADD USER (Upload Image) ---
//   const handleAddUser = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setIsLoading(true);
//     const formData = new FormData(event.currentTarget);

//     try {
//       const response = await fetch(`${BACKEND_URL}/add`, {
//         method: "POST",
//         body: formData,
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || "Server rejected request");
//       }

//       if (result.success) {
//         setUserCount((prev) => prev + 1);
//         alert("User added successfully! Model trained.");
//         (event.target as HTMLFormElement).reset();
//       }
//     } catch (error: any) {
//       console.error("Error adding user:", error);
//       alert(`Failed to add user: ${error.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       {userId ? (
//         <div className="text-center">
//           <h1 className="text-white p-3 text-4xl mt-[105px] md:mt-28 lg:mt-28">
//             Face Recognition System (Image Upload Mode)
//           </h1>

//           {isLoading && <p className="text-yellow-400 font-bold animate-pulse">Processing Image... Please wait...</p>}

//           <div className="flex justify-center space-x-4 p-5 m-5 flex-col-reverse md:flex-row lg:flex-row">
//             {/* --- LEFT SIDE: ATTENDANCE TABLE --- */}
//             <div className="bg-black bg-opacity-80 rounded-lg p-0 m-2 min-h-[400px] flex flex-col gap-5 flex-1">
//               <div className="flex items-center justify-center bg-white text-black rounded-md shadow-lg">
//                 <h2 className="p-2 font-bold">Today's Attendance</h2>
//                 <MdAssignment />
//               </div>
              
//               {/* Hidden Input for Attendance Image */}
//               <input 
//                 type="file" 
//                 ref={attendanceFileInputRef} 
//                 style={{ display: "none" }} 
//                 accept="image/*"
//                 onChange={handleAttendanceUpload}
//               />

//               <div className="flex items-center justify-center rounded-md shadow-lg bg-blue-600 text-white">
//                 <button
//                   className="w-full h-10 font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
//                   onClick={triggerAttendanceUpload}
//                   disabled={isLoading}
//                 >
//                   <MdCloudUpload className="text-xl" />
//                   {isLoading ? "Processing..." : "Upload Image to Mark Attendance"}
//                 </button>
//               </div>

//               <table className="bg-white w-full text-black rounded-md">
//                 <thead>
//                   <tr>
//                     <th className="px-4 py-2">S.No</th>
//                     <th className="px-4 py-2">Name</th>
//                     <th className="px-4 py-2">ID</th>
//                     <th className="px-4 py-2">Time</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {attendanceData.l > 0 ? (
//                     Array.from({ length: attendanceData.l }, (_, i) => (
//                       <tr key={i}>
//                         <td className="border px-4 py-2">{i + 1}</td>
//                         <td className="border px-4 py-2">{attendanceData.names[i]}</td>
//                         <td className="border px-4 py-2">{attendanceData.rolls[i]}</td>
//                         <td className="border px-4 py-2">{attendanceData.times[i]}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={4} className="p-4 text-center">No attendance marked yet</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* --- RIGHT SIDE: ADD USER FORM --- */}
//             <div className="bg-black bg-opacity-80 rounded-lg p-0 m-2 h-auto min-h-[400px] flex flex-col -mt-2 md:mt-2 lg:mt-2">
//               <form onSubmit={handleAddUser} encType="multipart/form-data">
//                 <div className="flex items-center justify-center bg-white text-black rounded-md shadow-lg">
//                   <h2 className="p-2 font-bold">Add New User</h2>
//                   <MdControlPointDuplicate className="h-5 w-5 font-bold" />
//                 </div>
//                 <div className="flex items-center justify-center flex-col gap-4 p-5">
//                   <div className="flex flex-col gap-2">
//                     <Label htmlFor="newusername" className="text-white text-lg">
//                       User Name*
//                     </Label>
//                     <Input
//                       type="text"
//                       id="newusername"
//                       name="newusername"
//                       className="text-black p-2 bg-slate-300 w-60"
//                       required
//                     />
//                   </div>
//                   <div className="flex flex-col gap-2">
//                     <Label htmlFor="newuserid" className="text-white text-lg">
//                       User ID No*
//                     </Label>
//                     <Input
//                       type="number"
//                       id="newuserid"
//                       name="newuserid"
//                       className="text-black p-2 bg-slate-300 w-60"
//                       required
//                     />
//                   </div>
//                   <div className="flex flex-col gap-2">
//                     <Label htmlFor="user_image" className="text-white text-lg">
//                       Upload Face Photo*
//                     </Label>
//                     <Input
//                       type="file"
//                       id="user_image"
//                       name="user_image"
//                       accept="image/*"
//                       className="text-black bg-slate-300 w-60 cursor-pointer"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <button
//                   className="bg-white text-black w-full rounded-md h-10 font-medium mt-6 hover:bg-gray-200"
//                   type="submit"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? "Uploading..." : "Add User & Train Model"}
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="p-4 relative z-10 text-center flex justify-center items-center h-screen w-full">
//           <BackgroundBeams />
//           <h1 className="mt-20 text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
//             Login Required
//           </h1>
//         </div>
//       )}
//     </>
//   );
// };

// export default AttendencePage;
"use client";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { useAuth } from "@clerk/nextjs";
import React, { useState, useRef } from "react";
import { MdAssignment, MdControlPointDuplicate, MdCloudUpload } from "react-icons/md";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Change to your backend URL (make sure port 8080 is specified)
const BACKEND_URL = "https://ubiquitous-xylophone-7q5grgx9wwpfx5qq-8080.app.github.dev";

interface AttendancePageProps {
  mess?: string;
  l: number;
  names: string[];
  rolls: string[];
  times: string[];
  totalreg: number;
}

const AttendencePage: React.FC<AttendancePageProps> = ({
  names,
  rolls,
  times,
  l,
  totalreg,
}) => {
  const [attendanceData, setAttendanceData] = useState({
    names: names || [],
    rolls: rolls || [],
    times: times || [],
    l: l || 0,
  });

  const [userCount, setUserCount] = useState(totalreg || 0);
  const { userId } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Ref for attendance image upload input
  const attendanceFileInputRef = useRef<HTMLInputElement>(null);

  // --- 1. TAKE ATTENDANCE (Upload Image) ---
  const triggerAttendanceUpload = () => {
    attendanceFileInputRef.current?.click();
  };

  const handleAttendanceUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || event.target.files.length === 0) return;

    setIsLoading(true);
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("attendance_image", file);

    try {
      const response = await fetch(`${BACKEND_URL}/start`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Server Error");
      }

      const data = await response.json();

      if (data.mess) {
        alert(data.mess);
      } else {
        setAttendanceData({
          names: data.names,
          rolls: data.rolls,
          times: data.times,
          l: data.l,
        });
        alert("Attendance Checked Successfully!");
      }
    } catch (error: any) {
      console.error("Error taking attendance:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
      if (attendanceFileInputRef.current) attendanceFileInputRef.current.value = "";
    }
  };

  // --- 2. ADD USER (Upload Image) ---
  const handleAddUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch(`${BACKEND_URL}/add`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        let errorMsg = "Server rejected request";
        try {
          const errJson = JSON.parse(errText);
          errorMsg = errJson.message || errorMsg;
        } catch {
          // If not JSON, fallback to plain text
          errorMsg = errText || errorMsg;
        }
        throw new Error(errorMsg);
      }

      const result = await response.json();

      if (result.success) {
        setUserCount((prev) => prev + 1);
        alert("User added successfully! Model trained.");
        (event.target as HTMLFormElement).reset();
      }
    } catch (error: any) {
      console.error("Error adding user:", error);
      alert(`Failed to add user: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {userId ? (
        <div className="text-center">
          <h1 className="text-white p-3 text-4xl mt-[105px] md:mt-28 lg:mt-28">
            Face Recognition System (Image Upload Mode)
          </h1>

          {isLoading && (
            <p className="text-yellow-400 font-bold animate-pulse">
              Processing Image... Please wait...
            </p>
          )}

          <div className="flex justify-center space-x-4 p-5 m-5 flex-col-reverse md:flex-row lg:flex-row">
            {/* --- LEFT SIDE: ATTENDANCE TABLE --- */}
            <div className="bg-black bg-opacity-80 rounded-lg p-0 m-2 min-h-[400px] flex flex-col gap-5 flex-1">
              <div className="flex items-center justify-center bg-white text-black rounded-md shadow-lg">
                <h2 className="p-2 font-bold">Today's Attendance</h2>
                <MdAssignment />
              </div>

              {/* Hidden Input for Attendance Image */}
              <input
                type="file"
                ref={attendanceFileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleAttendanceUpload}
              />

              <div className="flex items-center justify-center rounded-md shadow-lg bg-blue-600 text-white">
                <button
                  className="w-full h-10 font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  onClick={triggerAttendanceUpload}
                  disabled={isLoading}
                >
                  <MdCloudUpload className="text-xl" />
                  {isLoading ? "Processing..." : "Upload Image to Mark Attendance"}
                </button>
              </div>

              <table className="bg-white w-full text-black rounded-md">
                <thead>
                  <tr>
                    <th className="px-4 py-2">S.No</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.l > 0 ? (
                    Array.from({ length: attendanceData.l }, (_, i) => (
                      <tr key={i}>
                        <td className="border px-4 py-2">{i + 1}</td>
                        <td className="border px-4 py-2">{attendanceData.names[i]}</td>
                        <td className="border px-4 py-2">{attendanceData.rolls[i]}</td>
                        <td className="border px-4 py-2">{attendanceData.times[i]}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-4 text-center">
                        No attendance marked yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* --- RIGHT SIDE: ADD USER FORM --- */}
            <div className="bg-black bg-opacity-80 rounded-lg p-0 m-2 h-auto min-h-[400px] flex flex-col -mt-2 md:mt-2 lg:mt-2">
              <form onSubmit={handleAddUser} encType="multipart/form-data">
                <div className="flex items-center justify-center bg-white text-black rounded-md shadow-lg">
                  <h2 className="p-2 font-bold">Add New User</h2>
                  <MdControlPointDuplicate className="h-5 w-5 font-bold" />
                </div>
                <div className="flex items-center justify-center flex-col gap-4 p-5">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="newusername" className="text-white text-lg">
                      User Name*
                    </Label>
                    <Input
                      type="text"
                      id="newusername"
                      name="newusername"
                      className="text-black p-2 bg-slate-300 w-60"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="newuserid" className="text-white text-lg">
                      User ID No*
                    </Label>
                    <Input
                      type="number"
                      id="newuserid"
                      name="newuserid"
                      className="text-black p-2 bg-slate-300 w-60"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="user_image" className="text-white text-lg">
                      Upload Face Photo*
                    </Label>
                    <Input
                      type="file"
                      id="user_image"
                      name="user_image"
                      accept="image/*"
                      className="text-black bg-slate-300 w-60 cursor-pointer"
                      required
                    />
                  </div>
                </div>

                <button
                  className="bg-white text-black w-full rounded-md h-10 font-medium mt-6 hover:bg-gray-200"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Uploading..." : "Add User & Train Model"}
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 relative z-10 text-center flex justify-center items-center h-screen w-full">
          <BackgroundBeams />
          <h1 className="mt-20 text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Login Required
          </h1>
        </div>
      )}
    </>
  );
};

export default AttendencePage;
