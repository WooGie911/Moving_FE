/**
 * 드롭다운 옵션 타입
 */
export interface Option {
  value: string | number;
  label: string;
}

/**
 * 드롭다운 공통 props 타입
 */
export interface BaseDropdownProps {
  options: Option[];
  value: string | number | undefined;
  onChange: (value: string | number) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  disabled?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

/**
 * CustomDropdown 전용 props 타입
 */
export interface CustomDropdownProps extends BaseDropdownProps {
  twoColumns?: boolean; 
  dropdownClassName?: string; 
  dropdownWidth?: number;
  dropdownHeight?: number; 
  dropdownPadding?: string;
  optionClassName?: string; 
}
