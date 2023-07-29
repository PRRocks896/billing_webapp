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
  day = time.getDate();
  month = time.getMonth() + 1;
  year = time.getFullYear();

  const formattedDate = `
    ${day <= 9 ? `0${day}` : day}-${month <= 9 ? `0${month}` : month}-${year}
  `;

  // Format the time as HH:MM:SS
  const formattedTime = `${time.getHours()}:${time.getMinutes()}:${time
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;

  return (
    <div>
      <p>
        {formattedDate} {formattedTime}
      </p>
    </div>
  );
};

export default Clock;
