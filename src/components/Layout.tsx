import { PropsWithChildren, useState } from "react";

import Nav from "@/components/Nav";
import { signIn, useSession } from "next-auth/react";
import Logo from "./Logo";

export default function Layout({ children }: PropsWithChildren) {
  const { data: session } = useSession();

  const [showNav, setShowNav] = useState(false);

  if (!session) {
    return (
      <div className="bg-blue-900 w-screen h-screen flex items-center">
        <div className="text-center w-full">
          <button
            className="rounded-lg px-7 py-3 bg-white"
            onClick={() => signIn("google")}
          >
            Login with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-900 gap-2 h-screen ">
      <div className="md:hidden flex text-white gap-2 p-4">
        <button onClick={() => setShowNav(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
        <div className="flex justify-center grow">
          <Logo />
        </div>
      </div>
      <div className="flex gap-3 h-full">
        <Nav show={showNav} />
        <div className="bg-white flex-grow mt-1 mb-2 mr-2 rounded-lg p-2 ">
          <div className="mt-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
