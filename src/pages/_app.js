import "@/styles/globals.css";
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { socket } from "@/utils/socket";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [type, setType] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if(typeof window !== 'undefined') {
      setType(localStorage.getItem('type'));
      setUser(localStorage.getItem('user'));
    }
  })

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    router.push("/")
  }

  return (
    <>
      <Head>
        <title>Ping Pong Championships - Fitpage</title>
      </Head>

      <div className="top-bar border-b border-neutral-900">
          <img
            id="title"
            src="https://w7.pngwing.com/pngs/890/998/png-transparent-expense-management-appbrain-deloitte-luxembourg-expense-grass-revenue-money-thumbnail.png"
            alt="expense management system logo"
          ></img>
          {
            type === 'referee' || type === 'player' 
            ? <div className="nav">
                <Link href="/">Home</Link>
                <Link href="/championships">Championships</Link>
                <Link href="#" onClick={handleLogout}>Logout</Link>
              </div>
            : <div className="nav">
                <Link href="/sign-in">Sign-in</Link>
              </div>
          }
      </div>
      <div className="">
        <Component {...pageProps} />
      </div>
    </>
  );
}
