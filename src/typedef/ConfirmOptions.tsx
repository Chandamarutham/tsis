export interface ConfirmOptions {
  title?: string;
  description?: string;
  confirmBtnTitle?: string;
  rejectBtnTitle?: string;
}

export interface ConfirmModalProps extends ConfirmOptions {
  onConfirm: () => void;
  onReject: () => void;
}

export type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;
