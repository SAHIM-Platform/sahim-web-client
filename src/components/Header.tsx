import { Button } from './Button';
import Container from './Container';

function Header() {
  return (
    <Container>
      <header className="flex flex-col items-center justify-center text-center mt-32 min-h-[500px]">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          مرحبًا بك في منصة ساهم
        </h1>
        
        <p className="max-w-lg mx-auto mb-8 leading-loose">
          ساهم هي منصة تفاعلية مخصصة لطلاب كلية الهندسة وتقنية المعلومات بجامعة تعز، حيث نهدف إلى تسهيل التواصل الأكاديمي، تبادل المعرفة، ومساعدة الطلاب على النجاح في مسيرتهم الدراسية.
        </p>

        <Button
          href="/signup"
          variant="primary"
          size="lg"
        >
          أنشئ حساب الآن
        </Button>
      </header>
    </Container>
  );
}

export default Header;