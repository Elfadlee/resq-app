import { createContext, useContext, useState } from "react";
import TopAlert from "../components/TopAlert";

type AlertType = "success" | "error" | "warning" | "info";

type AlertContextType = {
  showAlert: (type: AlertType, message: string) => void;
};

const AlertContext = createContext<AlertContextType | null>(null);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alert, setAlert] = useState({
    visible: false,
    type: "info" as AlertType,
    message: "",
  });

  const showAlert = (type: AlertType, message: string) => {
    setAlert({ visible: true, type, message });
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

    
      <TopAlert
        visible={alert.visible}
        type={alert.type}
        message={alert.message}
        onHide={() => setAlert({ ...alert, visible: false })}
      />
    </AlertContext.Provider>
  );
}

export const useAlert = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) {
    throw new Error("useAlert must be used inside AlertProvider");
  }
  return ctx;
};
