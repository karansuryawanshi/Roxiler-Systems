// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Login from "./pages/auth/Login";
// import Signup from "./pages/auth/Signup";
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import AdminUsers from "./pages/admin/AdminUsers";
// import UserStores from "./pages/user/UserStores";
// import StoreDetail from "./pages/user/StoreDetail";
// import OwnerDashboard from "./pages/owner/OwnerDashboard";
// import Profile from "./pages/Profile";
// import ProtectedRoute from "./routes/ProtectedRoute";
// import AdminStores from "./pages/admin/AdminStores";
// import useAuth from "./hooks/useAuth";

// export default function App() {
//   const { user } = useAuth();

//   return (
//     <div className="min-h-screen">
//       <Navbar />
//       <main className="max-w-6xl mx-auto p-4">
//         <Routes>
//           <Route path="/" element={<Navigate to="/stores" replace />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />

//           <Route
//             path="/stores"
//             element={
//               <ProtectedRoute allowedRoles={["NORMAL_USER", "ADMIN"]}>
//                 <UserStores />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/stores/:id"
//             element={
//               <ProtectedRoute
//                 allowedRoles={["NORMAL_USER", "ADMIN", "STORE_OWNER"]}
//               >
//                 <StoreDetail />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/admin"
//             element={
//               <ProtectedRoute allowedRoles={["ADMIN"]}>
//                 <AdminDashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/admin/users"
//             element={
//               <ProtectedRoute allowedRoles={["ADMIN"]}>
//                 <AdminUsers />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/owner"
//             element={
//               <ProtectedRoute allowedRoles={["STORE_OWNER"]}>
//                 <OwnerDashboard />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/admin/stores"
//             element={
//               <ProtectedRoute allowedRoles={["ADMIN"]}>
//                 <AdminStores />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/profile"
//             element={
//               <ProtectedRoute
//                 allowedRoles={["ADMIN", "NORMAL_USER", "STORE_OWNER"]}
//               >
//                 <Profile />
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//       </main>
//     </div>
//   );
// }

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import UserStores from "./pages/user/UserStores";
import StoreDetail from "./pages/user/StoreDetail";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import Profile from "./pages/Profile";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminStores from "./pages/admin/AdminStores";
import { AuthProvider } from "./context/AuthContext"; // wrap app with provider

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-6xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/stores" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/stores"
              element={
                <ProtectedRoute allowedRoles={["NORMAL_USER", "ADMIN"]}>
                  <UserStores />
                </ProtectedRoute>
              }
            />
            <Route
              path="/stores/:id"
              element={
                <ProtectedRoute
                  allowedRoles={["NORMAL_USER", "ADMIN", "STORE_OWNER"]}
                >
                  <StoreDetail />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />

            <Route
              path="/owner"
              element={
                <ProtectedRoute allowedRoles={["STORE_OWNER"]}>
                  <OwnerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/stores"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminStores />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute
                  allowedRoles={["ADMIN", "NORMAL_USER", "STORE_OWNER"]}
                >
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}
