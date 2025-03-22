type ContainerProps = {
  children: React.ReactNode;
  classNames?: string;
  wide?: boolean;
};

function Container({ children, classNames, wide = false }: ContainerProps) {
  const maxWidthClass = wide
    ? 'max-w-[1440px] lg:max-w-[1600px]'
    : 'max-w-[700px] lg:max-w-[800px]';
  return (
    <div
      className={`${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 w-full ${classNames || ''
        }`}
    >
      {children}
    </div>
  );
}

export default Container;