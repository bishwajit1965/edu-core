import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LucideUserCheck2 } from "lucide-react";

const NavBar = () => {
  const { user, logout } = useAuth() as {
    user?: { avatar?: string; role?: string };
    logout: () => void;
  };

  console.log("USER IN NAVBAR", user);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const publicMenuItems = [
    {
      id: 1,
      name: "Home",
      path: "/",
    },
    {
      id: 2,
      name: "About",
      path: "/about",
    },
    {
      id: 3,
      name: "Contact",
      path: "/contact",
    },
    {
      id: 4,
      name: "Profile",
      path: "/profile",
    },
  ];

  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 lg:px-24">
      <div className="navbar-start">
        <div className="dropdown  lg:hidden flex">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              aria-label="Menu"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={-1}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {publicMenuItems.map((menu) => (
              <li key={menu.id}>
                <NavLink
                  to={menu.path}
                  end={menu.path === "/"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded transition ${
                      isActive
                        ? "bg-slate-200 text-slate-900"
                        : "hover:bg-slate-300 hover:text-slate-900"
                    }`
                  }
                >
                  {menu.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <a href="/" className="btn btn-ghost text-xl">
          Edu Core
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul tabIndex={-1} className="menu menu-horizontal px-1">
          {publicMenuItems.map((menu) => (
            <li key={menu.id}>
              <NavLink
                to={menu.path}
                end={menu.path === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded transition ${
                    isActive
                      ? "bg-slate-200 text-slate-900"
                      : "hover:bg-slate-300 hover:text-slate-900"
                  }`
                }
              >
                {menu.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-end">
        <button className="btn btn-ghost btn-circle">
          <svg
            aria-label="Search"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
        <button className="btn btn-ghost btn-circle">
          <div className="indicator">
            <svg
              aria-label="Notifications"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="badge badge-xs badge-primary indicator-item"></span>
          </div>
        </button>
      </div>
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
        >
          <div className="w-10 rounded-full">
            {user ? (
              <img alt="Tailwind CSS Navbar component" src={user?.avatar} />
            ) : (
              <span
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 shadow-xl flex items-center justify-center text-gray-800"
                title="Login/Register"
              >
                <LucideUserCheck2 size={20} />
              </span>
            )}
          </div>
        </div>
        <ul
          tabIndex={-1}
          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
        >
          {user ? (
            <>
              <li>
                <a href="/profile">Profile</a>
              </li>
              {user.role === "ADMIN" && (
                <li>
                  <Link to="/admin/dashboard">Admin Dashboard</Link>
                </li>
              )}
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <a href="/auth/login">Login</a>
              </li>
              <li>
                <a href="/auth/register">Register</a>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
