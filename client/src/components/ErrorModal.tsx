import classes from "./ErrorModal.module.css";
import { useEffect } from "react";

type ModalProps = {
  onConfirm: (e: React.SyntheticEvent) => void;
  onConfirmNative: (e: KeyboardEvent) => void;
};

const ErrorModal = ({ onConfirm, onConfirmNative }: ModalProps) => {
  useEffect(() => {
    function listener(this: Document, event: KeyboardEvent): any {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        onConfirmNative(event);
      }
    }
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <div className={classes.backdrop} onClick={onConfirm} />
      <div className={classes.modal}>
        <header className={classes.modal_header}>
          <h2>Oops!</h2>
        </header>
        <div className={classes.modal_content}>
          <p>This room is already full.</p>
        </div>
        <footer className={classes.modal_actions}>
          <button
            type="button"
            className={classes.modal_btn}
            onClick={onConfirm}
          >
            Okay
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ErrorModal;
