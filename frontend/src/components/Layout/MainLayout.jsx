import { LeftSidebar } from "@/Index";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex">
      {/* Left Sidebar Fixed */}
      <LeftSidebar />

      {/* Main Content Wrapper with margin to prevent overlap */}
      <div className="ml-[20%] flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
