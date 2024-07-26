import React from "react";

const Dates: React.FC = () => {
  return (
    <div className="p-10" style={{ backgroundColor: "#F9F3FD" }}>
      <h1
        className="flex justify-center items-center text-[39.2px]"
        style={{ color: "#333333" }}
      >
        Key Dates 2024
      </h1>

      <div className="relative overflow-x-auto py-8">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <tbody>
            <tr className="border-b dark:bg-gray-800 dark:border-gray-700"></tr>
            <tr className="dark:bg-gray-800">
              <td className="px-6 py-6 w-1/3" style={{ color: "#333333" }}>
                AUG 12 - AUG 31
              </td>
              <td className="px-6 py-4 w-1/3" style={{ color: "#333333" }}>
                Nominations Open
              </td>
              <td className="px-6 py-4" style={{ color: "#333333" }}>
                Nominations will close August 31st at 11:59 p.m. EST.
              </td>
            </tr>
            <tr className="border-b dark:bg-gray-800 dark:border-gray-700"></tr>
            <tr className="dark:bg-gray-800">
              <td className="px-6 py-4" style={{ color: "#333333" }}>
                SEP 1 - SEP 20
              </td>
              <td className="px-6 py-4" style={{ color: "#333333" }}>
                Industry Judging
              </td>
              <td className="px-6 py-4" style={{ color: "#333333" }}>
                Our panel of industry professionals will select the final
                nominees.
              </td>
            </tr>
            <tr className="border-b dark:bg-gray-800 dark:border-gray-700"></tr>

            <tr className="dark:bg-gray-800">
              <td className="px-6 py-6" style={{ color: "#333333" }}>
                OCT 1
              </td>
              <td className="px-6 py-4" style={{ color: "#333333" }}>
                Finalists Announced
              </td>
              <td className="px-6 py-4" style={{ color: "#333333" }}>
                Finalists for each award category are announced.
              </td>
            </tr>
            <tr className="border-b dark:bg-gray-800 dark:border-gray-700"></tr>

            <tr className="dark:bg-gray-800">
              <td className="px-6 py-4" style={{ color: "#333333" }}>
                OCT 10 - NOV 10
              </td>
              <td className="px-6 py-4" style={{ color: "#333333" }}>
                Public Votes
              </td>
              <td className="px-6 py-4" style={{ color: "#333333" }}>
                The public voting period begins. Voting will close on November
                10th at 11:59 p.m. EST.
              </td>
            </tr>
            <tr className="border-b dark:bg-gray-800 dark:border-gray-700"></tr>

            <tr className="dark:bg-gray-800">
              <td className="px-6 py-4" style={{ color: "#333333" }}>
                NOV 18
              </td>
              <td className="px-6 py-4" style={{ color: "#333333" }}>
                Winners Announced
              </td>
              <td className="px-6 py-4" style={{ color: "#333333" }}>
                Winners will be announced on November 18th.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dates;
