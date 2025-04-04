'use client';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from "lucide-react";
import UserInfo from "../UserInfo";
import { currentUser } from "@/data/mock-api";
import Link from "next/link";
import { motion, AnimatePresence } from 'framer-motion';

function UserDropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(prev => !prev);

  const closeDropdown = () => setIsOpen(false);
   // الإغلاق عند الضغط في أي مكان بالصفحة
   useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };
  document.addEventListener("mousedown", handleClickOutside);
   return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (

    <div className="relative space-x-6" ref={dropdownRef}>
       <button onClick={toggleDropdown}>
      <UserInfo
        name={currentUser.name}
        photo={currentUser.avatar}
      >
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </UserInfo>
      </button>
    </div>
    <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50"
      >
        <ul className="py-2 text-sm text-gray-700">
          <li>
            <Link
              href="#profile"
              onClick={closeDropdown}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Profile
            </Link>
          </li>
          <li>
            <Link
              href="#settings"
              onClick={closeDropdown}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Settings
            </Link>
          </li>
          <li>
            <button
              onClick={() => {
                // TODO: add sign out logic here
                closeDropdown();
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Sign Out
            </button>
          </li>
        </ul>
      </motion.div>
    )}
  </AnimatePresence>

  );
}

export default UserDropdownMenu;