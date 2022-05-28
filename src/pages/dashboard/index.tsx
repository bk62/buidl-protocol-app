import * as React from "react";
import Head from "next/head";

import { getSidebarLayout } from "../../components/layout/Layout";


import Dashboard from "../../components/dashboard/Dashboard"



function DashboardIndex() {
    return <>
        <Head>
            <title>Dashboard</title>
        </Head>
        <Dashboard />
    </>
}

DashboardIndex.getLayout = getSidebarLayout

export default DashboardIndex