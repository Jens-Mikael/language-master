import SVG from "react-inlinesvg";
import { croissantOne } from "@/app/fonts";

const AuthPage = ({ setIsAuthOpen, authType, setAuthType }) => {
  return (
    <div className="flex h-full">
      <div
        className="w-[45%] relative bg-cover flex flex-col justify-between p-10 whitespace-normal"
        style={{ backgroundImage: `url('images/authBanner2.png')` }}
      >
        <div className="flex flex-col gap-5">
          <i className="text-4xl w-1/2 font-bold ">
            "Sign up and don't be a pussy"
          </i>
          <i className="text-2xl">-Adonis</i>
        </div>
        <div className={`text-3xl ${croissantOne.className}`}>
          Language Mastery
        </div>
      </div>
      <div className="flex-1 bg-white h-full flex text-black ">
        <div className="flex flex-col flex-1 pl-20 py-10 pr-5 gap-10 overflow-scroll">
          <div className={`flex gap-4 transition-opacity`}>
            <button
              onClick={() => setAuthType("signUp")}
              className={`text-3xl font-bold ${
                authType === "signUp" ? "underline" : "text-black/60"
              }`}
            >
              Sign up
            </button>
            <button
              onClick={() => setAuthType("logIn")}
              className={`text-3xl font-bold ${
                authType === "logIn" ? "underline" : "text-black/60"
              }`}
            >
              Log in
            </button>
          </div>
          {/* GOOLE FACEBOOK, GITHUB */}
          <div className="flex flex-col gap-3">
            <button className="border-2 hover:bg-black/10 transition text-black/50 font-medium text-lg border-black/20 p-3 items-center justify-center flex gap-4 rounded-xl">
              <SVG
                className="w-8 h-8 "
                src="icons/google.svg"
                loader={<div className="h-8 w-8" />}
              />
              Continue with Google
            </button>
            <button className="border-2 hover:bg-black/10 transition text-black/50 font-medium text-lg border-black/20 p-3 items-center justify-center flex gap-4 rounded-xl">
              <SVG
                className="w-8 h-8 "
                src="icons/facebook.svg"
                loader={<div className="h-8 w-8" />}
              />
              Continue with Facebook
            </button>
            <button className="border-2 hover:bg-black/10 transition text-black/50 font-medium text-lg border-black/20 p-3 items-center justify-center flex gap-4 rounded-xl">
              <SVG
                className="w-8 h-8 "
                src="icons/github.svg"
                loader={<div className="h-8 w-8" />}
              />
              Continue with Github
            </button>
          </div>
          <div className="flex gap-2 items-center">
            <div className="grow h-0.5 bg-black/20" />
            <div className="text-black/40 font-medium">or email</div>
            <div className="grow h-0.5 bg-black/20" />
          </div>

          <form className="flex flex-col gap-14 group" novalidate>
            {/* EMAIL */}
            <div className="gap-7 flex flex-col">
              <div className="flex flex-col gap-2">
                <div className="font-medium text-sm text-black/50">Email</div>

                <input
                  type="email"
                  required
                  placeholder="name@email.com"
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  className="peer invalid:[&:not(:placeholder-shown):not(:focus)]:outline-red-500 ring-none outline outline-2 outline-black/30 focus:outline-black/60 p-2 rounded-lg bg-transparent w-full"
                />
                <div className="peer-[&:not(:placeholder-shown):not(:focus):invalid]:block hidden text-sm text-red-500">
                  Invalid email adress
                </div>
              </div>
              {/* USSRNAME */}
              {authType === "signUp" && (
                <div className="flex flex-col gap-2">
                  <div className="font-medium text-sm text-black/50">
                    Username
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Dragonboy666"
                    className="ring-none outline outline-2 outline-black/30 focus:outline-black/60 p-2 rounded-lg bg-transparent w-full"
                  />
                </div>
              )}

              {/* PASSWORD */}
              <div className="flex flex-col gap-2">
                <div className="font-medium text-sm text-black/50 peer-[&:not(:placeholder-shown):not(:focus):invalid]:hidden block">
                  Password
                </div>

                <input
                  type="password"
                  required
                  placeholder="your_password"
                  pattern=".{8,}"
                  className="peer invalid:[&:not(:placeholder-shown):not(:focus)]:outline-red-500 ring-none outline outline-2 outline-black/30 focus:outline-black/60 p-2 rounded-lg bg-transparent w-full"
                />
                <div className="hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
                  Password must contain at least 8 characters
                </div>
              </div>
            </div>
            {/* SUBMIT */}
            <div className="flex flex-col gap-7">
              <button
                type="submit"
                className="rounded-lg w-full p-3 text-white group-invalid:pointer-events-none group-invalid:bg-black/20 bg-indigo-600 group-valid:hover:bg-opacity-80 transition duration-300"
              >
                Sign up
              </button>
            </div>
          </form>
          <div className=" self-center flex gap-1">
            {authType === "signUp"
              ? "Already have an account?"
              : "Don't have an account?"}
            <button
              onClick={() =>
                setAuthType((prev) => (prev === "signUp" ? "logIn" : "signUp"))
              }
              className="underline"
            >
              {authType === "signUp" ? "Log in" : "Sign up"}
            </button>
          </div>
        </div>
        <button onClick={() => setIsAuthOpen(false)} className="p-5 self-start">
          <SVG src="icons/remove.svg" className="h-7 w-7 fill-black/60" loader={<div className="h-7 w-7" />} />
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
