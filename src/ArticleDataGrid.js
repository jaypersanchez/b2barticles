import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

const columns = [
  { field: 'id', header: 'ID', width: 10},
  { field: 'articleName', headerName: 'Article', width: 130 },
  { field: 'articleDesc', headerName: 'Description', width: 130 },
  { field: 'articlePrice', headerName: 'Price', width: 10 }
];

const rows = [
  { id: 0, articleName: 'Snow', articleDesc: 'Jon', articlePrice: 35 },
  { id: 1, articleName: 'Snow', articleDesc: 'Jon', articlePrice: 35 },
  { id: 2, articleName: 'Snow', articleDesc: 'Jon', articlePrice: 35 },
];

export default function DataTable({datarows}) {

    console.log(`datagrid ${datarows}`)

    return (
        <div style={{ height: 400, width: '100%' }}>
        <DataGrid
            rows={datarows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
        />
        </div>
  );
}
