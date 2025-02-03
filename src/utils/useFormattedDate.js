// utils/useFormattedDate.js
import { useEffect, useState } from "react";

export const useFormattedDate = () => {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const updateDate = () => {
      const date = new Date();
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const dayOfWeek = daysOfWeek[date.getDay()];
      const month = months[date.getMonth()];
      const dayOfMonth = date.getDate();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";

      setFormattedDate(
        `${dayOfWeek} ${month} ${dayOfMonth} ${hours}:${minutes} ${ampm}`
      );
    };

    updateDate();

    const intervalId = setInterval(updateDate, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return formattedDate;
};
