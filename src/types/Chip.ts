export interface ICircleTextLabelProps {
  text: string;
  clickAble?: boolean;
  onClick?: () => void;
  hasBorder1?: boolean;
  hasBorder2?: boolean;
  isSelected?: boolean;
  "aria-pressed"?: boolean;
  role?: string;
  tabIndex?: number;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}
export interface IMoveTypeLabelProps {
  type: "small" | "home" | "office" | "document" | string;
  "aria-label"?: string;
}
