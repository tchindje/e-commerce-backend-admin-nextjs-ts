import { PropsWithChildren } from "react";

import Nav from "@/components/Nav";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="bg-blue-900 gap-2 min-h-screen flex">
      <Nav />
      <div className="bg-white flex-grow mt-2 mb-2 mr-2 rounded-lg p-2">
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}
