import React from 'react';
import AdminDashboardComponent from '../Components/Admin/AdminDashboardComponent';
import Navbar from '../Components/Navbar';
const AdminDashboard = () => {
    return (
        <>
        {/* <Navbar t1={"Add Admin"} p1={"/addadmin"} t2={"Add Tourism Governor"} p2={"/addtourismgovernor"} t3={"Manage Users"} p3={"/viewusers"} t4={"Manager Products"} p4={"/manageproducts"} t5={"Manager Activities"} p5={"/manageactivities"} t6={"Manager Preference Tags"} p6={"/managepreferencetags"}/> */}
        <Navbar t6={"Logout"} p6={"/Login"}/>
        <AdminDashboardComponent/>
        </>
    );
};

export default AdminDashboard;