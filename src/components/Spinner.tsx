import React from "react";
import { BounceLoader } from "react-spinners";

type Props = {};

const Spinner = (props: Props) => {
  return <BounceLoader color={"#1E3A8A"} speedMultiplier={2} />;
};

export default Spinner;
