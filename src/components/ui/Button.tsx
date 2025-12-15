import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** If true, button will stretch to full width */
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  fullWidth,
  className = '',
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center rounded-full text-sm font-medium px-6 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  let variantClasses = '';

  switch (variant) {
    case 'primary':
      variantClasses = 'bg-red-600 text-white hover:bg-red-700';
      break;
    case 'secondary':
      variantClasses = 'bg-stone-900 text-white hover:bg-stone-800';
      break;
    case 'outline':
      variantClasses = 'border border-red-600 text-red-600 hover:bg-red-50';
      break;
    case 'ghost':
      variantClasses = 'text-red-600 hover:bg-red-50';
      break;
    case 'link':
      variantClasses = 'text-red-600 underline-offset-4 hover:underline bg-transparent px-0';
      break;
    default:
      variantClasses = '';
  }

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${base} ${variantClasses} ${widthClass} ${className}`}
      {...props}
    />
  );
};

export default Button;
