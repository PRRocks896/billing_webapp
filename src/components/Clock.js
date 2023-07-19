import React, { useState, useEffect } from "react";

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
  const formattedDate = `${time.getDate()}-${
    time.getMonth() + 1
  }-${time.getFullYear()}`;

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
