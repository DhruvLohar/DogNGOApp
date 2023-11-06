import React, { useState } from "react";

const Report = () => {
  const [startDay, setStartDay] = useState("");
  const [startMonth, setStartMonth] = useState("1");
  const [startYear, setStartYear] = useState("2000");
  const [endDay, setEndDay] = useState("");
  const [endMonth, setEndMonth] = useState("1");
  const [endYear, setEndYear] = useState("2000");
  const [maxStartDay, setMaxStartDay] = useState(31);
  const [maxEndDay, setMaxEndDay] = useState(31);

  const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  const monthsMaxDays = {
    1: 31,
    2: 28,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31,
  };

  const handleMonthChange = (month, isStart) => {
    if (isStart) {
      setStartMonth(month);
      setStartDay("");

      if (month === "2" && isLeapYear(parseInt(startYear, 10))) {
        setMaxStartDay(29);
      } else {
        setMaxStartDay(monthsMaxDays[month]);
      }
    } else {
      setEndMonth(month);
      setEndDay("");

      if (month === "2" && isLeapYear(parseInt(endYear, 10))) {
        setMaxEndDay(29);
      } else {
        setMaxEndDay(monthsMaxDays[month]);
      }
    }
  };

  const handleYearChange = (year, isStart) => {
    if (isStart) {
      setStartYear(year);
      setStartDay("");

      if (startMonth === "2" && isLeapYear(parseInt(year, 10))) {
        setMaxStartDay(29);
      } else {
        setMaxStartDay(monthsMaxDays[startMonth]);
      }
    } else {
      setEndYear(year);
      setEndDay("");

      if (endMonth === "2" && isLeapYear(parseInt(year, 10))) {
        setMaxEndDay(29);
      } else {
        setMaxEndDay(monthsMaxDays[endMonth]);
      }
    }
  };

  const handleDayChange = (day, isStart) => {
    if (isStart) {
      setStartDay(day);
    } else {
      setEndDay(day);
    }
  };

  const handleSubmit = () => {
    const startDate = new Date(startYear, startMonth - 1, startDay);
    const endDate = new Date(endYear, endMonth - 1, endDay);

    const datesBetween = [];

    while (startDate <= endDate) {
      datesBetween.push(new Date(startDate));
      startDate.setDate(startDate.getDate() + 1);
    }

    console.log("Dates between:", datesBetween);
    //generate report and download CSV
  };

  const generateOptions = (start, end) => {
    const options = [];
    for (let i = start; i <= end; i++) {
      options.push(i.toString());
    }
    return options;
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div style={{ marginBottom: "10px" }}>
        <h2>Start Date</h2>
        <div style={{ display: "flex", alignItems: "center" }}>
          <select
            value={startDay}
            onChange={(e) => handleDayChange(e.target.value, true)}
            style={{ marginRight: "10px" }}
          >
            <option value="">Day</option>
            {generateOptions(1, maxStartDay).map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <select
            value={startMonth}
            onChange={(e) => handleMonthChange(e.target.value, true)}
            style={{ marginRight: "10px" }}
          >
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
          <select
            value={startYear}
            onChange={(e) => handleYearChange(e.target.value, true)}
          >
            {generateOptions(2000, 2100).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <h2>End Date</h2>
        <div style={{ display: "flex", alignItems: "center" }}>
          <select
            value={endDay}
            onChange={(e) => handleDayChange(e.target.value, false)}
            style={{ marginRight: "10px" }}
          >
            <option value="">Day</option>
            {generateOptions(1, maxEndDay).map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <select
            value={endMonth}
            onChange={(e) => handleMonthChange(e.target.value, false)}
            style={{ marginRight: "10px" }}
          >
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
          <select
            value={endYear}
            onChange={(e) => handleYearChange(e.target.value, false)}
          >
            {generateOptions(2000, 2100).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        onClick={handleSubmit}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Generate Report
      </button>
    </div>
  );
};

export default Report;
