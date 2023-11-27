import SVG from "react-inlinesvg";
const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <div
      className={` fixed right-0 inset-0 z-20 flex lg:hidden transition ${
        sidebarOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* close */}
      <div onClick={() => setSidebarOpen(false)} className="flex-1" />
      {/* content */}
      <div className="h-full bg-[#0A092D] w-[250px] shadow-xl flex flex-col gap-5 p-2">
        <div className="flex justify-between">
          <div className="p-2 text-lg">Menu</div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="cursor pointer p-2"
          >
            <SVG
              src="/icons/remove.svg"
              className="h-7 w-7 fill-white"
              loader={<div className="h-7 w-7" />}
            />
          </button>
        </div>

        {/* items */}
        <div className="flex flex-col">
          {!isLoading ? (
            currentUser ? (
              <div className="relative h-full flex items-center gap-5">
                <Link
                  href="/create-set"
                  className="z-20 bg-blue-600 hover:bg-indigo-600 hover:scale-105 transition-all rounded-full p-1 cursor-pointer"
                  onClick={() => setIsNewOpen((prev) => !prev)}
                >
                  <SVG
                    src="/icons/new.svg"
                    className="h-8 w-8 fill-white"
                    loader={<div className="h-8 w-8" />}
                  />
                </Link>
                <div onClick={logout}>logout</div>
              </div>
            ) : (
              <>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setIsAuthOpen(true);
                      setAuthType("logIn");
                    }}
                    className="border border-white/20 px-2 py-1 rounded-lg"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => {
                      setIsAuthOpen(true);
                      setAuthType("signUp");
                    }}
                    className="bg-cyan-400 hover:bg-opacity-80 rounded-lg px-2 py-1"
                  >
                    Sign up
                  </button>
                  <div
                    className={`absolute inset-0 z-40 bg-black/80 transition duration-500 ${
                      isAuthOpen
                        ? " translate-y-0 opacity-100"
                        : "-translate-y-full opacity-0"
                    }`}
                  >
                    <AuthPage
                      setIsAuthOpen={setIsAuthOpen}
                      authType={authType}
                      setAuthType={setAuthType}
                    />
                  </div>
                </div>
              </>
            )
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
