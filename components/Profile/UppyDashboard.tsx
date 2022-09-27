import { useEffect } from "react";
import { Dashboard } from "@uppy/react";
import { useMyUppy } from "../../hooks";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import "@uppy/webcam/dist/style.css";

const UppyDashboard = () => {
  const uppy = useMyUppy();

  useEffect(() => {
    return () => uppy.close();
  }, [uppy]);

  return (
    <Dashboard
      uppy={uppy}
      plugins={["Webcam"]}
      theme="dark"
      width={300}
      height={300}
    />
  );
};
export default UppyDashboard;
