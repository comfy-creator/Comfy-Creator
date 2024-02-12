type ButtonType = "button" | "submit" | "reset" | undefined;

interface IProps {
  title: string;
  id?: string;
  className?: string;
  type?: ButtonType;
  disabled?: boolean;
  loading?: boolean;
  handleClick?: () => void;
}

const Button = ({
  handleClick,
  className,
  type,
  id,
  title,
  disabled,
}: IProps) => {
  return (
    <button
      id={id}
      className={`custom-button ${className}`}
      onClick={handleClick}
      type={type}
      title={title}
      disabled={disabled}
    >
      {title}
    </button>
  );
};

export default Button;
