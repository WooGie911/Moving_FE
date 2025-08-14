export interface IModalButton {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "solid" | "outline" | "outlined";
}

export interface IModalOptions {
  title: string;
  children: React.ReactNode;
  buttons?: IModalButton[];
  type?: "center" | "bottomSheet";
}

export interface IModalContextType {
  open: (options: IModalOptions) => void;
  close: () => void;
}
