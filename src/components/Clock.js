import React, { useState, useEffect } from "react";

let day;
let month;
let year;

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Format the date as DD-MM-YYYY
  day = time.getDate().toString().padStart(2, "0");
  month = (time.getMonth() + 1).toString().padStart(2, "0");
  year = time.getFullYear().toString().padStart(2, "0");

  const formattedDate = `${day}-${month}-${year}`;

  // Format the time as HH:MM:SS
  const formattedTime = `${time.getHours().toString().padStart(2, "0")}:${time
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${time.getSeconds().toString().padStart(2, "0")}`;

  return (
    <div>
      <p>
        {formattedDate} {formattedTime}
      </p>
    </div>
  );
};

export default Clock;
