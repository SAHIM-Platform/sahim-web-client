import Container from '@/components/Container';
import Form from "@/components/Form";

export default function Home() {
  return (
    <main className="bg-[url('/login-bg.jpg')] bg-no-repeat bg-fixed bg-cover bg-center min-h-screen">
      <Container >
        <div className='flex items-center justify-center  p-3 pb-10'>
        <Form />
        </div>
      </Container>
    </main>
  );
}
