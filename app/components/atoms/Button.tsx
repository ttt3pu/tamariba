import { ReactNode } from 'react';
import { RiAddBoxFill } from "react-icons/ri";
type Color = '';

type Props =  {
  to?: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  color?: Color;
  icon?: 'add';
};

export default function Button({ to, children, className, onClick = () => {}, color, icon }: Props) {
  const CustomTag = to ? 'a' : 'button';

  const colorClasses = (() => {
    switch (color) {
      default:
        return 'bg-yellow-600 text-white';
    }
  })();

  return (
    <CustomTag
      className={`cursor-pointer radius px-4 py-2 inline-flex items-center font-medium justify-center ${colorClasses} ${className}`}
      onClick={onClick}
      href={to}
    >
      {icon && (
        <span className="mr-4">
          <RiAddBoxFill />
        </span>
      )}
      <span>{children}</span>
    </CustomTag>
  );
}
