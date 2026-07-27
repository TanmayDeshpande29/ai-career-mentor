import { Outlet } from "react-router-dom";


function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">

      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

    </div>
  );
}

export default MainLayout;