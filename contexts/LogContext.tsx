import { createContext, useContext, useState } from "react";

const LogContext = createContext<any>(null);

export function useLog() {
  return useContext(LogContext);
}

export function LogProvider(props: any) {
  const [activityLogs, setActivityLogs] = useState<any[]>([]);

  return (
    <LogContext.Provider value={{ current: activityLogs }}>
      {props.children}
    </LogContext.Provider>
  );
}
