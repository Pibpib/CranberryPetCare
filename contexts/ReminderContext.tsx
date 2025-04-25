import { createContext, useContext, useState } from "react";

const ReminderViewContext = createContext<any>(null);

export function useReminderView() {
  return useContext(ReminderViewContext);
}

export function ReminderViewProvider(props: any) {
  const [currentReminder, setCurrentReminder] = useState<any>(null);

  return (
    <ReminderViewContext.Provider value={{ currentReminder, setCurrentReminder }}>
      {props.children}
    </ReminderViewContext.Provider>
  );
}
