import { Button } from './Button';
import Container from './Container';

interface HeaderProps {
  title: string;
  description: string;
  button?: {
    text: string;
    href: string;
    variant?: 'primary' | 'secondary';
  };
  className?: string;
}

function Header({ 
  title, 
  description, 
  button,
  className = ''
}: HeaderProps) {
  return (
    <Container medium>
      <header className={`flex flex-col items-center justify-center text-center mt-16 sm:mt-20 md:mt-24 min-h-[400px] sm:min-h-[450px] md:min-h-[500px] ${className}`}>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
          {title}
        </h1>
        
        <p className="text-sm sm:text-base max-w-lg mx-auto mb-6 sm:mb-8 leading-relaxed sm:leading-loose text-gray-600">
          {description}
        </p>

        {button && <Button
          href={button.href}
          variant={button.variant || 'primary'}
          size={'default'}
          className="sm:hidden"
        >
          {button.text}
        </Button>}

        {button && <Button
          href={button.href}
          variant={button.variant || 'primary'}
          size={'lg'}
          className="hidden sm:inline-flex"
        >
          {button.text}
        </Button>}
      </header>
    </Container>
  );
}

export default Header;