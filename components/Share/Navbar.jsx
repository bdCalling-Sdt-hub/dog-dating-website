"use client";
import Link from "next/link";
import { IoPersonCircleOutline } from "react-icons/io5";
import { FaBars, FaCross, FaTimes } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import logo from "../../asserts/logo.svg";
import { usePathname, useRouter } from "next/navigation";
import logOut from "./asserts/logOut.svg";
import profile from "./asserts/profile.svg";
import blankImg from "../../asserts/blankProfile.png";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import {
  selectUser,
  setAccessToken,
  setUserInfo,
} from "@/redux/slices/authSlice";
import { useUserProfileQuery } from "@/redux/api/features/profileApi";
import { getImageUrl } from "@/helpers/config/envConfig";

const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const profileRef = useRef(null);
  const pathName = usePathname();
  const dispatch = useDispatch();
  const cookies = new Cookies();

  const userData = useSelector(selectUser);

  const imageServerUrl = getImageUrl();

  const { data: userProfileData, isFetching } = useUserProfileQuery(
    {
      id: userData?.userId,
    },
    {
      skip: !userData?.userId,
    }
  );

  const userProfileImg = isFetching
    ? blankImg
    : imageServerUrl + userProfileData?.data?.image;

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleProfile = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        open &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleLogout = () => {
    dispatch(setAccessToken(null));
    dispatch(setUserInfo(null));
    cookies.remove("woof_spot_accessToken", { path: "/" });
    cookies.remove("woof_spot_refreshToken", { path: "/" });
    router.push("/login");
  };

  const adminRoutes = [
    { name: "Home", path: "/" },
    { name: "Friends", path: "/friends" },
    { name: "Woof Mail", path: "/woof-mail" },
    { name: "Fetch-Worthy Finds", path: "/fetch-worthy-finds" },
    { name: "Featured Pups", path: "/featured-pups" },
    { name: "Our Pack", path: "/our-pack" },
    { name: "Contact us", path: "/contact-us" },
    { name: "Dashboard", path: "/dashboard/all-products" },
  ];

  const userRoute = [
    { name: "Home", path: "/" },
    { name: "Friends", path: "/friends" },
    { name: "Woof Mail", path: "/woof-mail" },
    { name: "Fetch-Worthy Finds", path: "/fetch-worthy-finds" },
    { name: "Featured Pups", path: "/featured-pups" },
    { name: "Our Pack", path: "/our-pack" },
    { name: "Contact us", path: "/contact-us" },
  ];

  const normalRoute = [
    { name: "Home", path: "/" },
    { name: "Our Pack", path: "/our-pack" },
    { name: "Contact us", path: "/contact-us" },
  ];

  const menuItems =
    userData?.role === "admin"
      ? adminRoutes
      : userData?.role === "user"
      ? userRoute
      : normalRoute;

  return (
    // Navbar items Section
    <nav className="bg-[#FFFAF5] md:py-4 py-1 px-2  shadow  w-full z-50">
      <div className="container mx-auto flex justify-between items-center lg:flex-row flex-row-reverse">
        {/* Mobile Menu Toggle */}
        <div className="lg:hidden block text-right relative " ref={menuRef}>
          <button
            onClick={toggleMenu}
            className="inline-flex items-center justify-center p-2 
                      rounded-md  hover:text-gray-500
                      focus:outline-none   transition duration-150 ease-in-out "
            aria-label="Toggle menu"
          >
            <FaBars className="w-9 text-2xl " />
          </button>
          {isOpen && (
            <div className=" pb-3 space-y-1  text-right min-w-52 shadow-2xl rounded-2xl absolute right-0  bg-white z-20">
              <div className="relative px-2 py-1   bg-gray-700 rounded-tl-lg rounded-tr-lg ">
                <button onClick={toggleMenu} className="">
                  <ImCross className="text-white" />
                </button>
                {/* <IoPersonCircleOutline className="text-5xl text-right right-0 absolute  mt-1" /> */}
              </div>
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={`${item?.path}`}
                  className={`${
                    pathName == item.path ? "text-[#F88D58]" : ""
                  } block px-3  rounded-md text-base font-medium   hover:text-[#F88D58] transition duration-150 ease-in-out`}
                  aria-label={item.name}
                >
                  {item.name}
                </Link>
              ))}
              {userData && (
                <div className="me-3">
                  <Link href={`/profile`}>
                    <p className="text-black">Profile</p>
                  </Link>
                  <Link href={`/login`}>
                    <p className="text-black">Log Out</p>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Logo */}
        <Link href="/">
          <div className="flex justify-center items-center">
            <Image alt="pic" src={logo} width={100} className="w-16 lg:w-20 " />
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:block">
          <ul className="flex text-textPrimary font-inter font-bold leading-none text-fluid-base tracking-wide capitalize space-x-[17px] p-[10px]">
            {menuItems.map((item) => (
              <Link
                href={item?.path}
                key={item.name}
                className={`${
                  pathName == item.path ? "text-[#F88D58]" : ""
                } border-b-2 px-2 border-transparent hover:border-[#F88D58] duration-300`}
              >
                <li className="flex xl:text-lg  md:text-sm whitespace-nowrap">
                  {item.name}
                </li>
              </Link>
            ))}
          </ul>
        </div>

        {/* Profile Icon */}
        {/* <Link href="/sign-up" className="cursor-pointer"> */}
        {userData ? (
          <div
            ref={profileRef}
            className="relative lg:block hidden cursor-pointer select-none"
          >
            <div onClick={toggleProfile}>
              {/* <IoPersonCircleOutline className="text-5xl" /> */}
              <Image
                src={userProfileImg}
                alt={`profile`}
                width={1000}
                height={1000}
                className="rounded-full mr-4 w-12 ring-1 ring-[#F88D58] object-cover aspect-square"
              />
            </div>
            {open && (
              <div className="bg-[#F3F5FB] py-3 shadow-md absolute right-0 rounded z-50 w-32 p-1">
                <Link href="/profile">
                  <div className="flex gap-3">
                    <Image alt="profileImage" src={profile} className="w-4" />
                    <p
                      // onClick={toggleUserModal}
                      className="text-[#302F51] text-[18px] cursor-pointer font-bold"
                    >
                      Profile
                    </p>
                  </div>
                </Link>
                <div
                  onClick={handleLogout}
                  className="flex gap-3 mt-2 whitespace-nowrap"
                >
                  <Image alt="LogoutImage" src={logOut} className="w-4" />

                  <p
                    // onClick={toggleGroupModal}
                    className="text-[#302F51] cursor-pointer text-[18px] font-bold"
                  >
                    Log Out
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-5">
            <Link
              href="/login"
              className={` block py-1 px-4 border border-[#F88D58]  rounded-md text-lg font-bold    text-[#F88D58] transition duration-150 ease-in-out`}
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className={` block py-1 px-4 border border-[#F88D58]  rounded-md text-lg font-bold  bg-[#F88D58]  text-white transition duration-150 ease-in-out`}
            >
              Sign Up
            </Link>
          </div>
        )}
        {/* </Link> */}
      </div>
    </nav>
  );
};

export default Navbar;
