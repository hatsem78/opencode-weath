export interface MenuOption {
  value: string;
  label: string;
  handler: () => void | Promise<void>;
}
