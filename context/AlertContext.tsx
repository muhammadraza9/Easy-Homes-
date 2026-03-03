"use client";

import React, { createContext, useContext } from "react";
import { message as antdMessage } from "antd";

type MessageType = "success" | "error" | "info";

interface MessageContextType {
  showMessage: (content: string, type?: MessageType) => void;
  contextHolder: React.ReactNode;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messageApi, contextHolder] = antdMessage.useMessage();

  const showMessage = (content: string, type: MessageType = "info") => {
    messageApi.open({ content, type });
  };

  return (
    <MessageContext.Provider value={{ showMessage, contextHolder }}>
      {contextHolder} {/* Must render contextHolder */}
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) throw new Error("useMessage must be used within MessageProvider");
  return context;
};