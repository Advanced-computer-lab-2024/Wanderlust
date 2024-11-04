import React from 'react';
import Navbar from '../Components/Navbar';
import AddAdmin from '../Components/Admin/AddAdmin';
const AddAdminPage = () => {
    return (
        <>
        <Navbar t1={"Admin Dashboard"} p1={"/admindashboard"} t6={"Logout"} p6={"/Login"}/>
        <AddAdmin/>
        </>
    );
};

export default AddAdminPage;