import Link from 'next/link';
import Container from './Container';

const Footer = () => {
  return (
    <Container medium>
      <footer className="border-t mt-20 py-4 md:py-6">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <p className="text-gray-600 text-sm leading-relaxed">
            منصة <span className="text-primary font-semibold">SAHIM</span> اختصارً لـ (Student Academic Hub for Integrated Management) هي منصة تم تطويرها بواسطة قسم تقنية المعلومات – المستوى الثالث، في جامعة تعز، كمشروع لمقرر هندسة البرمجيات.
          </p>
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} SAHIM. جميع الحقوق محفوظة
          </div>
        </div>
      </footer>
    </Container>
  );
}

export default Footer; 
