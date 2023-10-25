import LearnNavbar from "@/components/LearnNavbar";

const Layout = ({ children }) => {
  return (
    <div className="absolute z-20 inset-0">
      <div className="h-full bg-[#0A092D] flex flex-col">
        <LearnNavbar />
        {children}
      </div>
    </div>
  );
};

export default Layout;

//bg-[#0A092D]
