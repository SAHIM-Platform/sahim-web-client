import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-white/30 backdrop-blur-md text-center py-4 text-white mt-auto">
      <Link href="#">سياسة الخصوصية </Link>
      <Link href="#">ألأسئلة الشائعة  </Link>
    </footer>
  );
};

export default Footer; 
