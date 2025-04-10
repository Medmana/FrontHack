"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggler from "./ThemeToggler";
import menuData from "./menuData";
import AlertIcon from "@/components/AlertIcon";

const Header = () => {
  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => setNavbarOpen(!navbarOpen);

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY >= 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Gestion des sous-menus
  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index: number) =>
    setOpenIndex(openIndex === index ? -1 : index);

  const usePathName = usePathname();

  return (
    <header
      className={`header fixed top-0 left-0 z-30 w-full transition-all ${
        sticky
          ? "bg-white dark:bg-gray-dark shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="container">
        <div className="relative flex items-center justify-between">
          {/* Logo */}
          <div className="pt-4 pb-4">
            <Link href="/" className="block">
              <span className="font-bold text-3xl text-blue-600">
                AI4CKD
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex items-center">
            <button
              onClick={navbarToggleHandler}
              className="lg:hidden p-2 rounded-md focus:outline-none"
            >
              <span
                className={`block h-0.5 w-6 bg-black dark:bg-white transition-transform ${
                  navbarOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-black dark:bg-white my-1 transition-opacity ${
                  navbarOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-black dark:bg-white transition-transform ${
                  navbarOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              />
            </button>

            <nav
              className={`navbar absolute right-0 top-full w-[250px] rounded-md border bg-white dark:bg-dark lg:static lg:w-auto lg:border-none lg:bg-transparent lg:flex ${
                navbarOpen ? "block" : "hidden"
              }`}
            >
              <ul className="lg:flex lg:space-x-8">
                {menuData.map((menuItem, index) => (
                  <li key={index} className="relative">
                    {menuItem.path ? (
                      <Link
                        href={menuItem.path}
                        className={`block py-2 px-4 text-sm ${
                          usePathName === menuItem.path
                            ? "text-primary dark:text-white"
                            : "text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                        }`}
                      >
                        {menuItem.title}
                      </Link>
                    ) : (
                      <>
                        <p
                          onClick={() => handleSubmenu(index)}
                          className="flex cursor-pointer items-center py-2 px-4 text-sm text-dark dark:text-white/70 hover:text-primary dark:hover:text-white"
                        >
                          {menuItem.title}
                          <span className="pl-2">
                            <svg width="20" height="20" viewBox="0 0 25 24">
                              <path
                                fill="currentColor"
                                d="M6.3 8.8a1 1 0 011.4 0L12 13.1l4.3-4.3a1 1 0 111.4 1.4l-5 5a1 1 0 01-1.4 0l-5-5a1 1 0 010-1.4z"
                              />
                            </svg>
                          </span>
                        </p>
                        <div
                          className={`absolute left-0 top-full w-[200px] rounded-md bg-white dark:bg-dark shadow-md transition-opacity ${
                            openIndex === index ? "block" : "hidden"
                          }`}
                        >
                          {menuItem.submenu.map((submenuItem, subIndex) => (
                            <Link
                              key={subIndex}
                              href={submenuItem.path}
                              className="block py-2 px-4 text-sm hover:text-primary dark:text-white/70 dark:hover:text-white"
                            >
                              {submenuItem.title}
                            </Link>
                          ))}
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <AlertIcon />

          {/* Boutons à droite */}
          <div className="flex items-center space-x-4">
            <ThemeToggler />
            <Link
              href="/logout"
              className="bg-red-600 text-white px-4 py-2 text-sm rounded-md hover:bg-red-700"
            >
              Déconnexion
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
