import Link from "next/link"
import React from "react"

const Footer = () => {
  return (
    <footer className="bg-theme text-white p-10 border-t-2 border-white">
      <footer className="footer">
        <aside>
          <svg
            width="50"
            height="50"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
            className="fill-current"
          >
            <path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
          </svg>
          <p>
            Group ? Ltd.
            <br />
            FPT University @2024
          </p>
        </aside>
        <nav>
          <header className="footer-title">Contacts</header>
          <p>
            For all inquiries or support needs, connect with Boostera dedicated team through Facebook Messenger, drop us
            an email at boostera@fu.com.vn, or get in touch via our Facebook Page.
          </p>
        </nav>
        <nav>
          <header className="footer-title">Become a Booster</header>
          <p>
            If you want to become a booster, please fill out the form on
            <Link href={"/become-booster"} className="font-semibold">
              {" "}
              this page.
            </Link>
          </p>
        </nav>
        <nav>
          <header className="footer-title">Become a Booster</header>
          <p>
            If you want to become a booster, please fill out the form on
            <Link href={"/become-booster"} className="font-semibold">
              {" "}
              this page.
            </Link>
          </p>
        </nav>
      </footer>
      <div className="mt-20">
        <header className="footer-title text-center">Legal Disclaimer</header>
        <p style={{ paddingLeft: "250px", paddingRight: "250px" }} className="text-center">
          This website is not endorsed or in any way affiliated with Activision Inc, Electronic Arts Inc, Valve
          Corporation, Riot Games Inc, Respawn Entertainment or Epic Games and does not reflect the views or opinions of
          the aforementioned entities or anyone officially involved in producing or managing Call of Duty Franchise,
          League of Legends, Teamfight Tactics, Dota 2, Apex Legends or Valorant. Call of Duty Franchise, League of
          Legends, Teamfight Tactics, Dota 2, Apex Legends or Valorant are trademarks or registered trademarks of the
          aforementioned entities in the U.S. and/or other countries. All submitted art content remains copyright of its
          original copyright holder.
        </p>
      </div>
    </footer>
  )
}

export default Footer
