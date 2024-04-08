type Props = {
  handleChange: (arg: string) => void;
  value: string;
  className?: string;
  placeholder?: string;
};

export default function FormInput({ handleChange, value, className, placeholder }: Props) {
  return (
    <input
      value={value}
      type="text"
      placeholder={placeholder}
      className={`px-4 py-2 bg-white rounded text-black ${className}`}
      onChange={(event) => handleChange(event.target.value)}
    />
  );
}
