import React, { useEffect, useState } from 'react'
import { VscLoading } from 'react-icons/vsc'
import { DataTable } from './DataTable';
import MUIDataTable from 'mui-datatables'
import {createTheme, ThemeProvider} from '@mui/material/styles'
import { formatDateIfDate } from '../utils';


export const PreviewData = ({currentReport, currentReportData, getReportData, id}) => {

    const [dataLoading, setDataLoading] = useState(false)
    const [selectedValue, setSelectedValue] = useState()


    const handleGetData = (dataSource, dataSourceType, columnList) => {
        setDataLoading(true)
        getReportData(dataSource, dataSourceType, columnList)
    }

    useEffect(() => {
        if(currentReportData) {
            setDataLoading(false)
        }
    }, [currentReportData])

    const createColumns = (colList) => {
        
        return colList.map((name) => ({
          name,
          label: name,
          options: {
            customBodyRender: (value, tableMeta, updateValue) => {
              // Manipulate the value here if needed
              return <span className='truncate text-black w-[98%]'>{formatDateIfDate(value)}</span>;
            },
            setCellProps: () => ({
              style: {
                width: '300px', // Set fixed width for each column
                maxWidth: '300px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                
              }
            })
          }
        }));
    };

    const options = {
        selectableRows: false,
        downloadOptions: {
            filename: `${currentReport?.title}.csv`
        },
        print: false,
        rowsPerPage: 100,
        rowStyle: (data, dataIndex, rowIndex) => {
            return rowIndex % 2 === 0 ? { backgroundColor: '#e4e4e7' } : { backgroundColor: '#ffffff' };
          },
    }

    console.log('currentReportData', currentReportData)

    const getMuiTheme = () =>
        createTheme({
            palette: {
                background: {
                    paper: '#0f172a'
                },
                mode: 'dark'
            },
            components: {
            MUIDataTable: {
                styleOverrides: {
                    root: {
                        height: '100%', // Ensure the table takes the full height
                        display: 'flex',
                        flexDirection: 'column',
                        
                    },
                },
            },
            // MUIDataTableHeadCell: {
            //     styleOverrides: {
            //       root: {
            //         color: '#fff', // Set the font color for the column headers
            //       },
            //     },
            //   },
            //   MuiSvgIcon: {
            //     styleOverrides: {
            //       root: {
            //         color: '#fff', // Set the color for the icons
            //       },
            //     },
            //   },
            MUIDataTableBodyRow: {
                styleOverrides: {
                  root: {
                    '&:nth-of-type(odd)': {
                      backgroundColor: '#f9f9f9', // Set the background color for odd rows
                    },
                    '&:nth-of-type(even)': {
                      backgroundColor: '#ffffff', // Set the background color for even rows
                    },
                  },
                },
            },
            
            MUIDataTableBody: {
                styleOverrides: {
                root: {
                    flex: '1 1 auto', // Allow the body to grow and shrink
                    
                },
                },
            },
            MUIDataTableFooter: {
                styleOverrides: {
                root: {
                    flexShrink: 0, // Prevent the footer from shrinking
                },
                },
            },
        },
    });

  return (
    <div className='  rounded-md flex flex-col flex-1 gap-4 p-2  overflow-x-hidden'>
        <div className='flex justify-between '>
            <p className='text-xl'>Preview Data</p>
            <div className="flex items-end gap-4">
                {selectedValue && <p className=''>Value: <span className='bg-white p-1 rounded-md shadow-sm shadow-zinc-400 w-64 ml-1'>{selectedValue}</span></p>}
                {(!dataLoading && currentReportData) && <button onClick={() => handleGetData(currentReport.dataSource, currentReport.dataSourceType, currentReport.columnList)} className='bg-zinc-200 shadow-sm shadow-zinc-400 p-1 active:scale-[.95]'>Refresh</button>}

            </div>

        </div>
        {currentReportData && (
            <div style={{ height: '100vh' }}>
                <ThemeProvider theme={getMuiTheme()}>
                <MUIDataTable
                    title={""}
                    data={currentReportData}
                    columns={createColumns(currentReport.columnList.split(","))}
                    options={options}
                />
                </ThemeProvider>
            </div>
            
        )}
        {(!currentReportData) && <div className="h-96 w-full flex justify-center items-center shadow-sm shadow-zinc-400 pb-10">
            {(!dataLoading) && <button onClick={() => handleGetData(currentReport.dataSource, currentReport.dataSourceType, currentReport.columnList)} className='bg-zinc-200 shadow-sm shadow-zinc-400 p-1 active:scale-[.95]'>Run report</button>}

            {(dataLoading) && <VscLoading className='animate-spin text-6xl' />}

        </div>}
    </div>
  )
}
