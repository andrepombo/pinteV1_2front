import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios';
import {
  Grid,
} from "@material-ui/core";

import PageTitle from "../../components/PageTitle";
import TablesAllLast from "./components/Tables/TablesAllLast/TableAllLast";

// const PieChartData = [
//   { name: "Group A", value: 400, color: "primary" },
//   { name: "Group B", value: 300, color: "secondary" },
//   { name: "Group C", value: 300, color: "warning" },
//   { name: "Group D", value: 200, color: "success" },
// ];

export default function Dashboard(props) {
  const [dataUpdate, setDataUpdate] = useState(null); // Inicializa como null para evitar erro

  useEffect(() => { 
    axiosInstance.get('update/')
      .then(res => {               
        if (res.data.length > 0 && res.data[0]['last_update']) {
          setDataUpdate(res.data[0]['last_update']);
        }
      })
      .catch(error => {
        console.log("Error fetching update data:", error);
      });
  }, []); // Executa apenas uma vez

  // Verifica se `dataUpdate` existe antes de converter para data
  const dateF = dataUpdate ? new Date(dataUpdate).toLocaleString("pt-BR") : "Data não disponível";

  return (
    <>
      <PageTitle title="Dashboard" time={`Última Sincronização: ${dateF}`} />
      <Grid item xs={12}>
        <TablesAllLast />
      </Grid>
    </>
  );
}

