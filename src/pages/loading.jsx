import React, { useEffect } from "react";

const loading = () => {
  useEffect(() => {
    console.log("loading");
  }, []);
  return <div>loading</div>;
};

export default loading;
