import React from "react";
import { Route, Switch } from "react-router-dom";
import classnames from "classnames";

// Styles
import useStyles from "./styles";

// Components
import Header from "../Header";
import Sidebar from "../Sidebar";
import ScrollToTop from "./ScrollToTop";

// Pages
import Dashboard from "../../pages/dashboard";
import DashboardObra from "../../pages/dashboard/DashboardObra";
import Epis from "../../pages/tables/TableObraEpis";
import CardObra from "../../pages/tables/TableCards";
import Equipes from "../../pages/tables/TableEquipes";
import Colabs from "../../pages/tables/TableColabs";
import ColabsObra from "../../pages/tables/TableColabsObra";
import ColabDetails from "../../pages/tables/TableColabDetails";
import ColabServices from "../../pages/tables/TableColabServices";
import NewColab from "../../pages/forms/Criar";
import EditColab from "../../pages/forms/Edit";
import EquipeColab from "../../pages/forms/Equipe";
import Typography from "../../pages/typography";
import Notifications from "../../pages/notifications/Notifications";
import Maps from "../../pages/maps";
import Tables from "../../pages/tables";
import TablesEpis from "../../pages/tables/TablesEpis";
import TableUsers from "../../pages/tables/TableUsers";
import Icons from "../../pages/icons";
import Charts from "../../pages/charts";

// Context
import { useLayoutState } from "../../context/LayoutContext";

function Layout() {
  const classes = useStyles();
  const layoutState = useLayoutState();

  return (
    <div className={classes.root}>
      <Header />
      <ScrollToTop />
      <Sidebar />
      <div
        className={classnames(classes.content, {
          [classes.contentShift]: layoutState.isSidebarOpened,
        })}
      >
        <div className={classes.fakeToolbar} />
        <Switch>
          <Route exact path="/app/dashboard" component={Dashboard} />
          <Route exact path="/app/teste2" component={DashboardObra} />
          <Route exact path="/app/typography" component={Typography} />
          <Route exact path="/app/tables" component={Tables} />
          <Route exact path="/app/tablesepis" component={TablesEpis} />
          <Route exact path="/app/obra/:board/:id" component={DashboardObra} />
          <Route exact path="/app/epis/:board" component={Epis} />
          <Route exact path="/app/equipes/:board/:id" component={Equipes} />
          <Route exact path="/app/cardobra/:board/:id" component={CardObra} />
          <Route exact path="/app/colabdetails/:id/:nome" component={ColabDetails} />
          <Route exact path="/app/colabservices/:obra_id/:id/:nome" component={ColabServices} />
          <Route exact path="/app/newcolab" component={NewColab} />
          <Route exact path="/app/editcolab/:id" component={EditColab} />
          <Route exact path="/app/equipecolab/:obra_id/:equipe" component={EquipeColab} />
          <Route exact path="/app/users" component={TableUsers} />
          <Route exact path="/app/colaboradores" component={Colabs} />
          <Route exact path="/app/colabsobra/:board/:obra_id" component={ColabsObra} />
          <Route exact path="/app/notifications" component={Notifications} />
          <Route exact path="/app/ui/maps" component={Maps} />
          <Route exact path="/app/ui/icons" component={Icons} />
          <Route exact path="/app/ui/charts" component={Charts} />
        </Switch>
      </div>
    </div>
  );
}

export default Layout;
