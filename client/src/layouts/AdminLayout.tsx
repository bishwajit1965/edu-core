import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/admin/AdminNavbar";
import AdminFooter from "../components/admin/AdminFooter";
import SideNav from "../components/admin/SideNav";

const AdminLayout = () => {
  return (
    <div className="grid lg:grid-cols-12 grid-cols-1 items-center justify-between gap-4  bg-white">
      <aside className="hidden lg:block lg:col-span-2 col-span-12 h-screen sticky top-0 self-start overflow-y-auto shadow-2xl">
        <div className="bg-gray-100 px-3 py-2 rounded-sm shadow-md border border-b border-gray-200 min-h-16 flex items-center">
          <h1 className="lg:text-xl text-lg font-bold">Edu Core</h1>
        </div>
        <div className="p-4">
          <SideNav />
        </div>
      </aside>

      <main className="lg:col-span-10 col-span-12 min-w-0 min-h-[calc(100vh-120px)] shadow-xl">
        <AdminNavbar />

        <div className="min-h-[calc(100vh-116px)] p-4">
          <Outlet />
        </div>

        <AdminFooter />
      </main>
    </div>
  );
};

export default AdminLayout;
