import React from "react";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";

import "../assets/styles/nointernet.scss";

const LastDailyReportPending = () => {
    const navigate = useNavigate();
    return (
        <div className="no-connection-card">
            <div className="no-internet-page">
                <h1>Daily Report is Pending</h1>
                <p>Please Add Pending Daily Report First.</p>
                <Button
                    variant="contained"
                    type="button"
                    onClick={() => {
                        navigate('/add-daily-report')
                    }}
                >Go To Daily Report Page</Button>
            </div>
        </div>
    );
};

export default LastDailyReportPending;
