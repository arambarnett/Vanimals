import { Button } from "@material-ui/core";
import { useTranslation } from "i18n";
import DialogForm from "./DialogForm";

const ConfirmationDialog = ({
  cancelLabel,
  continueLabel,
  onContinue,
  onCancel,
  callback,
  onClose,
  actions,
  ...rest
}) => {
  const { t } = useTranslation();

  const wrapAction = async (action) => {
    if (action) await action();
    if (onClose) onClose();
  };

  const wrappedOnClose = () => {
    if (onCancel) onCancel();
    onClose();
  };

  const defaultActions = [
    { text: cancelLabel || t("CANCEL"), onClick: () => wrapAction(onCancel) },
    {
      text: continueLabel || t("CONTINUE"),
      onClick: () => wrapAction(onContinue),
      variant: "contained",
      color: "secondary",
    },
  ];

  return (
    <DialogForm
      cross
      open
      actions={(actions || defaultActions).map(
        ({ text, ...rest }, index) => (
          <Button
            {...rest}
            key={index}
          >
            {text}
          </Button>
        ),
      )}
      onClose={wrappedOnClose}
      {...rest}
    />
  );
};

export default ConfirmationDialog;
