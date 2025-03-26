import Container from '@/components/Container';
import Form from "@/components/Form";

export default function Home() {
  return (
    <main className="bg-[url('/login-bg.jpg')] bg-no-repeat bg-fixed bg-cover bg-center min-h-screen overflow-x-hidden">
      <Container>
        <div className='flex items-center justify-center min-h-screen py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8'>
          <Form />
        </div>
      </Container>
    </main>
  );
}
