import React, { Children, PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import { CategoryType } from "../../types";

type Props = {
  category: CategoryType;
  onClose: () => void;
  onDelete: (category: CategoryType) => void;
};

const Modal = ({ onClose, category, onDelete }: Props) => {
  const onConfirmHandler = () => {
    onDelete(category);
  };

  const onCancelHandler = () => {
    onClose();
  };

  return createPortal(
    <div className="">
      <div className="backdrop" onClick={onCancelHandler} />
      <div className="dialogs">
        <h1 className="mt-10">
          Are you really want to delete the {category.name} category ?
        </h1>
        <div className="flex mb-5 gap-2">
          <button className="btn-default" onClick={onCancelHandler}>
            NO
          </button>
          <button className="btn-red " onClick={onConfirmHandler}>
            YES
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("dialogs")!
  );
};

export default Modal;
