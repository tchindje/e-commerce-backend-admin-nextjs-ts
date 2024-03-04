import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

import Layout from "@/components/Layout";

export default function Home() {
  
  const { data: session } = useSession();

  return (
    <Layout>
      <div className="text-blue-900 flex justify-between gap-3 mb-3 overflow-hidden">
        <h2>
          <button onClick={() => signIn()}>login</button>
          Hello , <b> {session?.user?.name}</b>
        </h2>
        <div className=" flex bg-gray-300 gap-1 pr-2  items-center rounded-md ">
          <img
            className="rounded-full"
            src={session?.user?.image}
            alt="image"
            width={25}
            height={25}
          />
          <span>{session?.user?.name}</span>
        </div>
      </div>
    </Layout>
  );
}
