import { useEffect, useState } from 'react';

const getCurrentDate = () => new Date().toISOString().split('T')[0];

export const useDateChangeChecker = (interval = 60000) => {
    const [dateMismatch, setDateMismatch] = useState(false);

    useEffect(() => {
        // const checkDate = () => {
        //     const currentDate = getCurrentDate();
        //     const serverDate = localStorage.getItem('serverDate');

        //     if (serverDate && serverDate !== currentDate) {
        //         setDateMismatch(true);
        //         localStorage.removeItem("managerId");
        //         localStorage.removeItem("managerName");
        //         localStorage.removeItem('serverDate');
        //     }
        // };

        // checkDate(); // Initial check
        // const timer = setInterval(checkDate, interval);

        // return () => clearInterval(timer); // Cleanup on unmount
    }, [interval]);

    return dateMismatch;
};
