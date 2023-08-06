import React, { useState } from 'react';
import { useGlobalFilter, useTable } from 'react-table';
import * as XLSX from 'xlsx';
import { decryptData } from '../utils/encryption';
import 'tailwindcss/tailwind.css';

const RosterPage: React.FC = () => {
  const [jsonData, setJsonData] = useState<unknown[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [filterInput, setFilterInput] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        setJsonData(data);
        setTableData(data);
      };
      reader.readAsBinaryString(file);
    }
  };
  

  const handleDecryptData = () => {
    const encryptedData = localStorage.getItem('jsonData');
    const jsonData = decryptData(encryptedData);
    setJsonData(jsonData);
    setTableData(jsonData); // Fix: Update state with the decrypted data, not the previous state.
  };

  const columns = React.useMemo(
    () =>
      Object.keys(jsonData[0] || {}).map((key) => ({
        Header: key,
        accessor: key,
      })),
    [jsonData]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
  } = useTable({ columns, data: tableData }, useGlobalFilter);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => { // Fix: Add the event type to the function parameter.
    const value = e.target.value || undefined;
    setGlobalFilter(value);
    setFilterInput(value);
  };

  return (
    <div className="p-6">
      <input 
        type="file" 
        onChange={handleFileChange} 
        className="mb-4 p-2 rounded border border-gray-300" 
      />
  
      <button 
        onClick={handleDecryptData} 
        className="py-2 px-4 rounded bg-blue-500 text-white mb-4"
      >
        Decrypt Data
      </button>
  
      <input
        value={filterInput}
        onChange={handleFilterChange}
        placeholder={"Search..."}
        className="py-2 px-4 rounded bg-white text-black mb-4"
      />
  
      <div>
        <table
          {...getTableProps()}
          className="table-fixed w-full text-left whitespace-nowrap"
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-100">
                {headerGroup.headers.map((column) => (
                  <th 
                    {...column.getHeaderProps()} 
                    className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
  
          <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td 
                      {...cell.getCellProps()} 
                      className="px-6 py-4 text-sm text-gray-500"
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default RosterPage;
