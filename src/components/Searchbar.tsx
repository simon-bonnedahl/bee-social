import React from "react";

function Searchbar() {
  return (
    <div>
      <form>
        <label
          htmlFor="default-search"
          className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Search
        </label>
        <div className="relative w-96">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              aria-hidden="true"
              className="h-5 w-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 pl-10 text-sm text-gray-900 focus:border-orange-400 focus:ring-orange-400 dark:border-gray-400 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-orange-400 dark:focus:ring-orange-400"
            placeholder="Search for a user, post, or hashtag"
            required
          />
          <button
            type="submit"
            className="absolute right-2.5 bottom-2.5 rounded-lg bg-orange-400 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-orange-400 dark:hover:bg-orange-500 dark:focus:ring-orange-500"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}

export default Searchbar;
