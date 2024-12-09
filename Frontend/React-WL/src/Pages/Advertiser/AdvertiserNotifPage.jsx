import React from 'react';
import AdvertiserNavBar from '../../Components/NavBars/AdvertiserNavBar';
import AdvertiserNotif from '../../Components/AdvertiserNotif';
import { Bell } from 'lucide-react'; // Add this line

const AdvertiserNotifPage = () => {
  return (
    <>
      <AdvertiserNavBar />
      <AdvertiserNotif />
    </>
  );
};

export default AdvertiserNotifPage;