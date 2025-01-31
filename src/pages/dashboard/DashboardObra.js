import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios';
import { Link } from 'react-router-dom';
import {
  Grid,
  LinearProgress,
  Select,
  OutlinedInput,
  MenuItem,
  Button
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  LineChart,
  Line,
  Area,
  PieChart,
  Pie,
  Cell,
  YAxis,
  XAxis,
  Tooltip
} from "recharts";
import {useParams } from 'react-router-dom';

// styles
import useStyles from "./styles";

// components
import Widget from "../../components/Widget/Widget";
import PageTitle from "../../components/PageTitle/PageTitle";
import { Typography } from "../../components/Wrappers/Wrappers";
import Dot from "../../components/Sidebar/components/Dot";
import TableObraLast from "./components/Tables/TablesObraLast /TableObraLast.js";

//import BigStat from "./components/BigStat/BigStat";
import ApexHeatmap from "./components/Charts/ApexHeatmap";
import ApexBars from "./components/Charts/ApexBars";
import ApexLineColabs from "./components/Charts/ApexLineColabs";
import AutoCompleteCustom from "../../components/Widget/AutoCompleteMultiple";
import TextField from '@mui/material/TextField';


export default function Dashboard2(props) {
  var classes = useStyles();
  var theme = useTheme();
  
  
  const { board } = useParams();
  const { id } = useParams();

  const initialData =  [
    { name: "", data: [] }
  ]

  // local
  const [data_update, setDataUpdate] = useState([]); //table data
  
  const [Heatdata, setHeatData] = useState(initialData); //Heatmap data
  
  const [PieData, setPieData] = useState([]); 

  const [UsersData, setUsersData] = useState(initialData); 
  
  const [macros, setMacros] = useState([]); //Heatmap data


  console.log(Heatdata)
 

  const user = {
    data: macros
  };
  
  
 
var invalidEntries = 0;

 function checkD(data) {
  if (user.data.includes(data.macro)) {
    return true;
  } else {
    data = {'x':data.x, "y": data.y}
    return false;
  }
}  

  useEffect(() => { 
    axiosInstance.get(`graphsdata/${id}/?q=${macros}`)
    
        .then(res => {             
            setPieData(res.data['pie'])
            setHeatData(res.data['heat'])
            setUsersData(res.data['users'])
            console.log(res.data)
            
        })    
  }, [macros])

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
    const dateF = date.toLocaleString("pt-BR")
    
  return (
    <>
      <PageTitle title={board} time = {'Última Sincronização: ' + dateF}  button={<>
      <Button
        component={Link} to={'/app/equipes/' + board + "/" + id}
        variant="contained"
        style={{ fontWeight: 'bold'}}
        size="large"
        color="secondary"
        
      >
          Equipes
      </Button>

      <Button
        component={Link} to={'/app/colabsobra/' + board + "/" + id}
        variant="contained"
        style={{ fontWeight: 'bold', marginLeft:"10px"}}
        size="large"
        color="secondary"
        
      >
        Produção
      </Button>
      
      <Button
        component={Link} to={'/app/cardobra/' + board + '/' + id}
        variant="contained"
        style={{ fontWeight: 'bold', marginLeft:"10px"}}
        size="large"
        color="secondary"
        
      >
        Tabela de Dados
      </Button>
      
      </>} />
      
      <Grid container spacing={4}>

        <Grid item lg={4} md={4} sm={6} xs={12}>
          <Widget
            title="Colaboradores (Teste)"
            upperTitle
            disableWidgetMenu
            disableWidgetAutoCompleteMultiple2
            //bodyClass={classes.fullHeightBody}
            bodyClass={classes.tableOverflow}
            className={classes.card}
          >
            <ApexLineColabs/>
          </Widget>
        </Grid>
       

        <Grid item lg={4} md={8} sm={6} xs={12}>
          <Widget
            title="Colaboradores 2"
            upperTitle
            disableWidgetMenu
            disableWidgetAutoCompleteMultiple2
            className={classes.card}
            //bodyClass={classes.fullHeightBody}
            bodyClass={classes.tableOverflow}
          >
           
          </Widget>
        </Grid>

      
        <Grid item lg={4} md={4} sm={6} xs={12}>
          <Widget title="Status Unidades" upperTitle disableWidgetMenu
            disableWidgetAutoCompleteMultiple2 className={classes.card}>
            <Grid container spacing={2}>
              <Grid item xs={5}>
                <ResponsiveContainer width="100%" height={144}>
                  <PieChart>
                    <Pie
                      data={PieData}
                      innerRadius={28}
                      outerRadius={50}
                      dataKey="value"
                      cx="50%"
                    >
                      {PieData.reverse().map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={theme.palette[entry.color].main}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </Grid>
              <Grid item xs={6}>
                <div className={classes.pieChartLegendWrapper}>
                  {PieData.map(({ name, value, color }, index) => (
                    <div key={color} className={classes.legendItemContainer}>
                      <Dot color={color} />
                      <Typography style={{ whiteSpace: "nowrap", fontSize: 14 }} >
                        &nbsp;{name}&nbsp;
                      </Typography>
                      <Typography color="text" colorBrightness="secondary" >
                        &nbsp;{value}
                      </Typography>
                    </div>
                  ))}
                </div>
              </Grid>
            </Grid>
          </Widget>
        </Grid>

        <Grid item xs={12}>
          <Widget  title="Unidades" upperTitle disableWidgetMenu  bodyClass={classes.tableOverflow}
            setMacros={setMacros}> 
            <ApexHeatmap  data2={Heatdata}/>
          </Widget>
        </Grid>

      <Grid item lg={6} md={8} sm={6} xs={12}>
          <Widget
            title="Atividade Supervisores"
            upperTitle
            disableWidgetMenu
            disableWidgetAutoCompleteMultiple2
            className={classes.card}
            //bodyClass={classes.fullHeightBody}
            bodyClass={classes.tableOverflow}
          >
            <ApexBars data={UsersData}/>
          </Widget>
        </Grid>
        <Grid item xs={12}>
            <TableObraLast/>
        </Grid>
        
        {/* <Grid item xs={12}>
            <Table/>
        </Grid> */}
      </Grid>
    </>
  );
}





