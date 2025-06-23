import React from "react";
import shortid from "shortid";
import ConfirmationDialog from "components/Dialogs/ConfirmationDialog";

const DialogContext = React.createContext({
  create: () => {},
  confirm: () => {},
});

export const DialogProvider = ({ children }) => {
  const [dialogs, setDialogs] = React.useState([]);

  const closeDialog = (dialogId) => {
    const dialog = dialogs.find((d) => d.dialogId === dialogId);
    const onCloseFn = dialog?.onClose;
    if (onCloseFn) onCloseFn();
    setDialogs((ds) => ds.filter((d) => d.dialogId !== dialogId));
  };

  const create = (options) => {
    const dialogId = shortid.generate();
    const dialog = { ...options, dialogId, open: true };
    setDialogs((ds) => [...ds, dialog]);
    return {
      close: () => closeDialog(dialogId),
    };
  };

  const confirm = (props) => new Promise((res) => {
    create({
      ...props,
      onContinue: () => res(true),
      callback: () => res(true),
      onCancel: () => res(false),
    });
  });

  const contextValue = React.useRef({ create, confirm });

  return (
    <DialogContext.Provider value={contextValue.current}>
      {children}
      {dialogs.map(({ dialogId, ...props }) => {
        const DialogType = props.dialogType || ConfirmationDialog;
        return (
          <DialogType
            key={dialogId}
            onClose={() => closeDialog(dialogId)}
            {...props}
          />
        );
      })}
    </DialogContext.Provider>
  );
};

export const useDialogs = () => React.useContext(DialogContext);
