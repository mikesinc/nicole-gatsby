import React from "react";
import { Navigate } from "react-big-calendar";
import TimeGrid from "react-big-calendar/lib/TimeGrid";
import * as dates from "date-arithmetic";

class MyWeek extends React.Component {
  render() {
    let { date } = this.props;
    let range = MyWeek.range(date);

    return <TimeGrid {...this.props} range={range} eventOffset={15} />;
  }
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

MyWeek.range = date => {
  let start = date;
  let end = dates.add(start, 1, "day");

  let current = start;
  let range = [];

  while (dates.lte(current, end, "day")) {
    range.push(current);
    current = dates.add(current, 1, "day");
  }

  return range;
};

MyWeek.navigate = (date, action) => {
  switch (action) {
    case Navigate.PREVIOUS:
      return dates.add(date, -7, "day");

    case Navigate.NEXT:
      return dates.add(date, 7, "day");

    default:
      return date;
  }
};

MyWeek.title = date => {
  return `${monthNames[date.getMonth()]}`;
};

export default MyWeek;
