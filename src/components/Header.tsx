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
    <Container>
      <header className={`flex flex-col items-center justify-center text-center mt-32 min-h-[500px] ${className}`}>
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          {title}
        </h1>
        
        <p className="max-w-lg mx-auto mb-8 leading-loose">
          {description}
        </p>

        {button && <Button
          href={button.href}
          variant={button.variant || 'primary'}
          size={'lg'}
        >
          {button.text}
        </Button>}
      </header>
    </Container>
  );
}

export default Header;