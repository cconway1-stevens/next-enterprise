import React, { useState } from "react"
import { useGlobalFilter, useSortBy, useTable } from "react-table"
import * as XLSX from "xlsx"
import { decryptData, encryptData } from "../utils/encryption" // Import encryption and decryption functions
import "tailwindcss/tailwind.css"

const RosterPage: React.FC = () => {
    const [jsonData, setJsonData] = useState<unknown[]>([])
    const [tableData, setTableData] = useState<any[]>([])
    const [filterInput, setFilterInput] = useState("")
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (evt) => {
        const bstr = evt.target.result as string
        try {
          const wb = XLSX.read(bstr, { type: "binary" })
          const wsname = wb.SheetNames[0]
          const ws = wb.Sheets[wsname]
          const data = XLSX.utils.sheet_to_json(ws)

          // Encrypt the data before storing it in local storage
          const encryptedData = encryptData(JSON.stringify(data))
          localStorage.setItem("jsonData", encryptedData)

          // Store the original data in the tableData state variable
          setTableData(data)
        } catch (error) {
          // Handle error when reading or processing the Excel file
          console.error("Error reading the Excel file:", error)
        }
      }
      reader.onerror = (evt) => {
        console.error("Error reading the file:", evt.target.error)
      }
      reader.readAsBinaryString(file)
    }
  }

  const handleDecryptData = () => {
    const encryptedData = localStorage.getItem("jsonData")
    if (encryptedData) {
      try {
        // Decrypt the data from local storage
        const decryptedData = JSON.parse(decryptData(encryptedData))
        setJsonData(decryptedData)

        // Store the decrypted data in the tableData state variable
        setTableData(decryptedData)
      } catch (error) {
        // Handle error when decrypting data
        console.error("Error decrypting data:", error)
      }
    }
  }

  const columns = React.useMemo(
    () =>
      Object.keys((jsonData[0] as Record<string, unknown>) || {}).map((key) => ({
        Header: key,
        accessor: key,
      })),
    [jsonData]
  )

  // Add the useSortBy hook to enable sorting
  // Move the useTable hook outside of the useMemo hook
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
  } = useTable({ columns, data: tableData }, useGlobalFilter, useSortBy)


  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || undefined
    setGlobalFilter(value)
    setFilterInput(value)
  }

  return (
    <div className="p-6">
      <label htmlFor="fileInput" className="mb-2 block">
        Add File:
      </label>
      <input
        type="file"
        id="fileInput"
        onChange={handleFileChange}
        className="mb-4 rounded border border-gray-300 p-2"
      />

      <button onClick={handleDecryptData} className="mb-4 rounded bg-blue-500 px-4 py-2 text-white">
        Decrypt Data
      </button>

      <label htmlFor="filterInput" className="mb-2 block">
        Search:
      </label>
      <input
        id="filterInput"
        value={filterInput}
        onChange={handleFilterChange}
        placeholder={"Search..."}
        className="mb-4 rounded bg-white px-4 py-2 text-black"
      />

      <div>
        <table {...getTableProps()} className="w-full table-fixed whitespace-nowrap text-left">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}> {/* Add sort toggle props */}
                    {column.render("Header")}
                    <span>
                      {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""} {/* Display sorting indicator */}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RosterPage
