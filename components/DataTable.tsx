
import React from 'react';

interface DataTableProps {
  data: string[][];
  title: string;
}

const TableIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M2 3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3Zm0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8Zm0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2Z" clipRule="evenodd" />
    </svg>
);


export const DataTable: React.FC<DataTableProps> = ({ data, title }) => {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] p-4 text-slate-500">
        <TableIcon className="h-16 w-16 opacity-50 mb-4"/>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p>Data will appear here once loaded.</p>
      </div>
    );
  }

  const [header, ...rows] = data;

  return (
    <div className="w-full h-full max-h-[60vh] overflow-auto">
      <table className="w-full text-sm text-left text-slate-300">
        <thead className="text-xs text-sky-300 uppercase bg-slate-800 sticky top-0">
          <tr>
            {header.map((col, index) => (
              <th key={index} scope="col" className="px-6 py-3 whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="bg-slate-850 border-b border-slate-700 hover:bg-slate-800 transition-colors">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-6 py-4 whitespace-nowrap">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
