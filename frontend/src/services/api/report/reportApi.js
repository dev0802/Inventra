export const getConsolidatedReport = async (fromDate, toDate) => {
  const response = await fetch(
    `${process.env.REACT_APP_API_REPORT_CONSOLIDATED}?fromDate=${fromDate}&toDate=${toDate}`
  );
  const data = await response.json();
  return data;
};