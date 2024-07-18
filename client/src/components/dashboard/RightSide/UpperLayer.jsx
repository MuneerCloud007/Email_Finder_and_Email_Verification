import React from 'react';

const Popup = () => {
  return (
    <div className="flex gap-4 justify-evenly">
      <div className="bg-green-100 rounded-md p-4 flex flex-col items-center gap-4 text-center">
        <div className="flex justify-center items-center w-8 h-8 rounded-full bg-green-500">
          <svg
            className="w-4 h-4 stroke-current text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-gray-800">Extension Installed!</h2>
          <p className="text-sm text-gray-600">
            <a href="#" className="underline text-blue-500">
              Watch tutorial
            </a>{' '}
            to learn how to find emails and extract leads directly from LinkedIn.
          </p>
        </div>
      </div>
      <div className="bg-green-100 rounded-md p-4 flex flex-col items-center gap-4 text-center">
        <div className="flex justify-center items-center w-8 h-8 rounded-full bg-green-500">
          <svg
            className="w-4 h-4 stroke-current text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-gray-800">
            You've Completed All the Steps!
          </h2>
          <p className="text-sm text-gray-600">
            Now, you're fully equipped to supercharge your prospecting with
            SalesQL
          </p>
          <p className="text-sm text-green-500">Account connected!</p>
        </div>
      </div>
    </div>
  );
};

export default Popup;
