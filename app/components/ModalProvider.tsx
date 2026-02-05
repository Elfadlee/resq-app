import React, { createContext, useContext, useState, ReactNode } from "react";
import AppModal from "./AppModal";

type ShowModalOptions = {
  title: string;
  message: string;
  primaryText?: string;
  secondaryText?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
};

type ModalContextType = {
  showModal: (options: ShowModalOptions) => void;
  hideModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<ShowModalOptions>({
    title: "",
    message: "",
  });

  const showModal = (opts: ShowModalOptions) => {
    setOptions(opts);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}

      <AppModal
        visible={visible}
        title={options.title}
        message={options.message}
        primaryText={options.primaryText ?? "موافق"}
        secondaryText={options.secondaryText}
        onPrimary={() => {
          hideModal();
          options.onPrimary?.();
        }}
        onSecondary={
          options.secondaryText
            ? () => {
                hideModal();
                options.onSecondary?.();
              }
            : undefined
        }
      />
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("useModal must be used inside ModalProvider");
  }
  return ctx;
}
