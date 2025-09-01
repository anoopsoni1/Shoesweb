// import React, { useState } from "react";
// import {  useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import { setUser } from "../Feature/Slicetwo";

// function Update() {
// const user = useSelector((state) => state.user.userData);
//   const dispatch = useDispatch()
//   const [newFullName, setNewFullName] = useState(user.FirstName);
//   const [newEmail, setNewEmail] = useState(user.email);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("anoop"); 
//          console.log(token);
         
//       const res = await axios.post(
//         "http://localhost:5000/api/v1/user/update", 
//         { FirstName: newFullName, email: newEmail },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, 
//           },
//         }
//       );
//        console.log(res);
//        dispatch(setUser(user));
//       alert("Account updated successfully!");
//     } catch (error) {
//       console.error(error);
//       alert(error.response?.data?.message || "Update failed");
//         alert("Account not updated successfully!");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="p-4 space-y-3 max-w-md mx-auto">
//       <input
//         type="text"
//         value={newFullName}
//         onChange={(e) => setNewFullName(e.target.value)}
//         placeholder="Full Name"
//         className="border p-2 w-full rounded"
//       />
//       <input
//         type="email"
//         value={newEmail}
//         onChange={(e) => setNewEmail(e.target.value)}
//         placeholder="Email"
//         className="border p-2 w-full rounded"
//       />
//       <button
//         type="submit"
//         className="bg-blue-600 text-white px-4 py-2 rounded w-full"
//       >
//         Update Account
//       </button>
//     </form>
//   );
// }

// export default Update;
