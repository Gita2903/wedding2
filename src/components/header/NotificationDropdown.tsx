"use client";

import { cn } from "@/utils";
import { Link } from "@/i18n/navigation";
import { useState, useMemo } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { CalenderIcon, DollarLineIcon } from "@/icons";
import { useWedding } from "@/context/WeddingContext";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleClick = () => {
    toggleDropdown();
    setNotifying(false);
  };

  const { data } = useWedding();
  const notifications = useMemo(() => {
    const now = new Date();
    const notifs: {
      id: string;
      title: string;
      desc: string;
      time: string;
      icon: React.ReactNode;
    }[] = [];
    
    (data?.tasks || []).forEach(task => {
      if (task.status === "Selesai") return;
      
      const dueDate = new Date(task.dueDate);
      const diffTime = dueDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) {
        notifs.push({
          id: task.id || task.title,
          title: "Tugas Terlewat",
          desc: task.title,
          time: `Terlewat ${Math.abs(diffDays)} hari`,
          icon: <CalenderIcon className="h-5 w-5 text-error-500" />
        });
      } else if (diffDays <= 7) {
        notifs.push({
          id: task.id || task.title,
          title: "Segera Jatuh Tempo",
          desc: task.title,
          time: `Dalam ${diffDays} hari`,
          icon: <DollarLineIcon className="h-5 w-5 text-warning-500" />
        });
      }
    });

    return notifs.slice(0, 5); // Max 5 notifications
  }, [data?.tasks]);

  return (
    <div className="relative">
      <button
        className="dropdown-toggle relative flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={handleClick}
      >
        <span
          className={cn(
            "absolute top-0.5 right-0 z-10 h-2 w-2 rounded-full bg-orange-400",
            !notifying ? "hidden" : "flex",
          )}
        >
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
        </span>
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -left-13.5 mt-4.25 flex w-87.5 flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg sm:w-90.25 xl:right-0 xl:left-auto dark:border-gray-800 dark:bg-gray-dark"
      >
        <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Notifikasi
          </h5>
          <button
            onClick={toggleDropdown}
            className="dropdown-toggle text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg
              className="fill-current"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <ul className="flex custom-scrollbar h-auto flex-col overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Tidak ada notifikasi baru
              </li>
            ) : (
              notifications.map((notification) => (
                <li key={notification.id}>
                  <DropdownItem
                    onItemClick={closeDropdown}
                    className="flex gap-3 rounded-none px-4 py-3 hover:bg-gray-100 dark:hover:bg-white/5"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                      {notification.icon}
                    </span>
                    <div>
                      <h4 className="text-theme-sm font-medium text-gray-700 dark:text-gray-300">
                        {notification.title}
                      </h4>
                      <p className="text-theme-xs text-gray-500 dark:text-gray-400">
                        {notification.desc}
                      </p>
                      <span className="mt-1 block text-theme-xs text-gray-500 dark:text-gray-500">
                        {notification.time}
                      </span>
                    </div>
                  </DropdownItem>
                </li>
              ))
            )}
        </ul>
        <Link
          href="/"
          className="mt-3 block rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          Lihat Semua
        </Link>
      </Dropdown>
    </div>
  );
}
