import React from "react";
import { useSelector } from "react-redux";

const Home = () => {
  const customer = useSelector((state) => state.customer);
  console.log(customer);
  return <div>Home</div>;
};

export default Home;
