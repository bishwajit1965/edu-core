import { LucideSettings, LucideUser } from "lucide-react";
import { NavLink } from "react-router-dom";
interface SideNavProps {
  onNavigate?: () => void;
}

const SideNav = ({ onNavigate }: SideNavProps) => {
  const size = 18; // Set the desired size for the icons
  const menuItems = [
    {
      id: 1,
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LucideSettings size={size} />,
    },
    {
      id: 2,
      name: "Users",
      path: "/admin/dashboard/users",
      icon: <LucideUser size={size} />,
    },
    {
      id: 3,
      name: "Settings",
      path: "/admin/dashboard/settings",
      icon: <LucideSettings size={size} />,
    },
  ];

  return (
    <div>
      <div className="mb-2">
        <h2 className="lg:text-xl font-bold ">Navigation</h2>
      </div>
      <ul>
        {menuItems.map((item) => (
          <li key={item.id}>
            <NavLink
              to={item.path}
              end={item.path === "/admin/dashboard"}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded transition ${
                  isActive
                    ? "bg-slate-200 text-slate-900"
                    : "hover:bg-slate-300 hover:text-slate-900"
                }`
              }
            >
              {item.icon} {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideNav;
