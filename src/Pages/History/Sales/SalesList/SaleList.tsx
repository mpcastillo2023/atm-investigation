import salesData from "../SalesData";
import SaleItem from "./SaleItem/SaleItem";

export default function SaleList() {
  const salesDataTest = salesData.map((sale, index) => {
    return <SaleItem sale={sale} key={index} />;
  });
  console.log(salesDataTest);
  return salesDataTest;
}
