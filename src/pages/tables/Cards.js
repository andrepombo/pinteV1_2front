import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { Link } from "@material-ui/core";
import Grid from '@material-ui/core/Grid'
import { localization }  from '../dashboard/components/Tables/localization';
import { tableIcons }  from '../dashboard/components/Tables/icons';
import axiosInstance from '../../axios';
import MaterialTable from "material-table";
import  { Chip } from "@material-ui/core";
import useStyles from "./styles";
import * as XLSX from 'xlsx';
import { FaFileExcel } from 'react-icons/fa'; // Excel Icon



function Cards() {
  const classes = useStyles();
  const states = {
    complete: "success",
    aquiraz: "warning",
    incomplete: "secondary",
  };

  const [data, setData] = useState([]); //table data
  const [data_update, setDataUpdate] = useState([]); //table data

  console.log(data)

  var obj = data.reduce(function(acc, cur, i) {
    acc[cur.equipe] = cur.equipe;

    return acc;
  }, {});

  const removeProp = '';

  const { [removeProp]: remove, ...rest } = obj;


  const ordered = Object.values(rest).sort().reduce(
    (obj, key) => {
      obj[key] = rest[key];
      return obj;
    },
    {}
  );

  var obj2 = data.reduce(function(acc, cur, i) {
    acc[cur.med] = cur.med;

    return acc;
  }, {});

  const removeProp2 = '';

  const { [removeProp2]: remove2, ...rest2 } = obj2;

  const ordered2 = Object.values(rest2).sort().reduce(
    (obj, key) => {
      obj[key] = rest2[key];
      return obj;
    },
    {}
  );

  var columns = [
    //{title: "Id", field: "id"},
    {title: "Obra", field: "board",hidden:true},
    {title: "LocalCode", field: "local", render:rowData=> <Link href={`${rowData.cardUrl}`} target="_blank">{rowData.local}</Link>},
    {title: "Macro", field: "macro"},
    {title: "Local", field: "card"},
    {title: "Pacote", field: "pacote"},
    {title: "Descrição", field: "checklist"},

    {title: "Item1", field: "i1_item",hidden:true},
    {title: "Item1_status", field: "i1_status", hidden:true, lookup: {complete: "complete", incomplete: "incomplete"},
    render: (rowData) => <Chip label={rowData.i1_status}  classes={{root: classes[states[rowData.i1_status.toLowerCase()]]}} />  },
    {title: "Item1_Data_Usuário", field: "i1_data",hidden:true},
    {title: "Item1_Usuário", field: "i1_user", hidden:true, width: 0},
    {title: "Item1_Data_Auto", field: "i1_date_auto",hidden:true, type: "date", render: rowData => moment(rowData.i1_date_auto).format('DD/MM/YYYY')},

    {title: "Item2", field: "i2_item",hidden:true},
    {title: "Item2_status", field: "i2_status", hidden:true, lookup: {complete: "complete", incomplete: "incomplete"},
    render: (rowData) => <Chip label={rowData.i2_status}  classes={{root: classes[states[rowData.i2_status.toLowerCase()]]}} />  },
    {title: "Item2_Data_Usuário", field: "i2_data"},
    {title: "Item2_Usuário", field: "i2_user", hidden:true, width: 0},
    {title: "Item2_Data_Auto", field: "i2_date_auto",hidden:true, type: "date", render: rowData => moment(rowData.i2_date_auto).format('DD/MM/YYYY')},

    {title: "Item3", field: "i3_item",hidden:true},
    {title: "Item3_status", field: "i3_status", lookup: {complete: "complete", incomplete: "incomplete"},
    render: (rowData) => <Chip label={rowData.i3_status}  classes={{root: classes[states[rowData.i3_status.toLowerCase()]]}} />  },
    {title: "Item3_Data_Usuário", field: "i3_data"},
    {title: "Item3_Usuário", field: "i3_user", hidden:true, width: 0},
    {title: "Item3_Data_Auto", field: "i3_date_auto",hidden:true, type: "date", render: rowData => moment(rowData.i3_date_auto).format('DD/MM/YYYY')},

    {title: "Item4", field: "i4_item",hidden:true},
    {title: "Item4_status", field: "i4_status",hidden:true},
    {title: "Medição", field: "med", lookup: ordered2},
    {title: "Item4_Usuário", field: "i4_user", hidden:true, width: 0},
    {title: "Item4_Data_Auto", field: "i4_date_auto",hidden:true, type: "date", render: rowData => moment(rowData.i4_date_auto).format('DD/MM/YYYY')},

    {title: "Item5", field: "i5_item",hidden:true},
    {title: "Item5_status", field: "i5_status", hidden:true,lookup: {complete: "complete", incomplete: "incomplete"},
    render: (rowData) => <Chip label={rowData.i5_status}  classes={{root: classes[states[rowData.i5_status.toLowerCase()]]}} />  },
    {title: "Equipe", field: "equipe", lookup: ordered},
    {title: "Item5_Usuário", field: "i5_user", hidden:true, width: 0},
    {title: "Item5_Data_Auto", field: "i5_date_auto",hidden:true,width: 0, type: "date", render: rowData => moment(rowData.i5_date_auto).format('DD/MM/YYYY')},

    {title: "Link", field: "cardUrl",hidden:true, width: 0},
  ]

  const { id } = useParams();
  const { board } = useParams();

  //for error handling
  const [iserror, setIserror] = useState(false)
  const [errorMessages, setErrorMessages] = useState([])

  console.log(board)
  console.log(id)


  useEffect(() => {
    axiosInstance.get('carddata/' + id)
        .then(res => {
            setData(res.data)
            //console.log(res.data)
        })
        .catch(error=>{
            console.log("Error")
        })
    }, [])

    useEffect(() => {
      axiosInstance.get('update/')
          .then(res => {
              setDataUpdate(res.data[0]['last_update'])
          })
          .catch(error=>{
              console.log("Error")
          })
      }, [])

      var date = new Date(data_update)
      //console.log(date)
      const dateF = date.toLocaleString("pt-BR")
      //console.log(dateF);

  const handleRowDelete = (oldData, resolve) => {
    console.log(oldData.id)
    axiosInstance.delete('deletecard/'+oldData.id)
      .then(res => {

        const dataDelete = [...data];
        const index = oldData.tableData.id;
        dataDelete.splice(index, 1);
        setData([...dataDelete]);
        resolve()
      })
      .catch(error => {
        setErrorMessages(["Delete failed! Server error"])
        setIserror(true)
        resolve()
      })
  }

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'table-data.xlsx');
  };

  return (
    <div className="App">
      <Grid container spacing={1}>
          <Grid item xs={1}></Grid>
          <Grid item xs={12}>
            <MaterialTable
              title= {board}
              localization={localization}
              columns={columns}
              data={data}
              actions={[
                {
                  icon: () => <FaFileExcel />,  // Custom Excel iconn
                  tooltip: 'Export to Excel',
                  isFreeAction: true,
                  onClick: handleExportExcel,
                },
              ]}
              icons={tableIcons}
              options={{
                tableLayout: "auto",
                sorting: true, search: true,
                padding:"dense",
                searchFieldAlignment: "right", searchAutoFocus: true, searchFieldVariant: "standard",
                filtering: true, paging: true, pageSizeOptions: [5, 10, 15, 25, 50, 100], pageSize: 10,
                paginationType: "stepped",  exportButton: true,
                actionsColumnIndex: -1,
                exportAllData: true,
                exportFileName: board + '_' + dateF,
                addRowPosition: "first",
                showFirstLastPageButtons: true,
                columnsButton: true,
                rowStyle: (data, index) => index % 2 === 0 ? { background: "#f5f5f5" } : null,
              }}
              editable={{
                onRowDelete: (oldData) =>
                  new Promise((resolve) => {
                    handleRowDelete(oldData, resolve)
                  }),
              }}
            />
          </Grid>
          <Grid item xs={3}></Grid>
        </Grid>
    </div>
  );
}

export default Cards;
