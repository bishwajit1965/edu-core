import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import SideNav from "./SideNav";

const AdminNavbar = () => {
  const [isOpenSideNav, setIsOpenSideNav] = useState(false);

  const auth = useAuth() as { logout?: () => void };

  const { user } = useAuth() as {
    user?: {
      avatar?: string;
      email?: string;
      role: string;
    };
  };

  const closeSideNav = () => setIsOpenSideNav(false);

  const handleLogout = () => {
    closeSideNav();
    auth.logout?.();
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex min-h-16 items-center justify-between gap-3 border border-b border-gray-200 bg-gray-100 px-3 py-2 sm:px-4 shadow-md">
        <div className="flex min-w-0 items-center gap-3">
          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setIsOpenSideNav((prev) => !prev)}
            aria-label={isOpenSideNav ? "Close navigation" : "Open navigation"}
            aria-expanded={isOpenSideNav}
            aria-controls="mobile-admin-navigation"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-500 lg:hidden m-0 p-0"
          >
            {isOpenSideNav ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link
            to="/admin/dashboard"
            className="truncate text-base font-bold capitalize sm:text-lg"
          >
            Edu Core {user?.role ?? "Admin"} Panel
          </Link>
        </div>

        {/* Account menu */}
        <div className="dropdown dropdown-end shrink-0">
          <button
            type="button"
            tabIndex={0}
            aria-label="Open account menu"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              {user?.avatar ? (
                <img src={user.avatar} alt="User avatar" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-300 font-semibold">
                  {user?.email?.charAt(0).toUpperCase() ?? "A"}
                </div>
              )}
            </div>
          </button>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content z-50 mt-3 w-52 rounded-box bg-base-100 p-2 shadow-lg"
          >
            {user ? (
              <>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <button type="button" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/auth/login">Login</Link>
                </li>
                <li>
                  <Link to="/auth/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </header>

      {/* Mobile navigation drawer */}
      {isOpenSideNav && (
        <div className="lg:hidden">
          <button
            type="button"
            aria-label="Close navigation backdrop"
            onClick={closeSideNav}
            className="fixed inset-0 top-16 z-40 bg-black/40"
          />

          <aside
            id="mobile-admin-navigation"
            aria-label="Mobile admin navigation"
            className="fixed bottom-0 left-0 top-16 z-50 w-[min(18rem,85vw)] overflow-y-auto border-r border-gray-200 bg-white p-4 shadow-xl"
          >
            <SideNav onNavigate={closeSideNav} />
          </aside>
        </div>
      )}
    </>
  );
};

export default AdminNavbar;
