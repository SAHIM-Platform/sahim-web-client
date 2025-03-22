import Container from '@/components/Container';
import Form from "@/components/Form";

export default function Home() {
  return (
    <main className="bg-[url('/login-bg.jpg')] bg-no-repeat bg-fixed bg-cover bg-center min-h-screen flex items-center">
      <Container >
        <div className='flex items-center justify-center'>
        <Form />
        </div>
      </Container>
    </main>
  );
}
