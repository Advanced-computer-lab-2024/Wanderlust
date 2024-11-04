import React from 'react';
import AddTourismGovernor from '../Components/Admin/AddTourismGovernor';
import Navbar from '../Components/Navbar';
const AddTourismGovernorPage = () => {
    return (
        <>
        <Navbar t1={"Admin Dashboard"} p1={"/admindashboard"} t6={"Login"} p6={"/Login"}/>
        <AddTourismGovernor/>
        </>
    );
};

export default AddTourismGovernorPage;