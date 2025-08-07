export interface ICircleTextLabelProps {
  text: string;
  clickAble?: boolean;
  onClick?: () => void;
  hasBorder1?: boolean;
  hasBorder2?: boolean;
  isSelected?: boolean;
}
export interface IMoveTypeLabelProps {
  type: "small" | "home" | "office" | "document" | string;
  "aria-label"?: string;
}
