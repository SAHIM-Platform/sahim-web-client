import Container from '../Container';
import Card from '../Card';

const features = [
  {
    title: "ناقش مع زملائك",
    description: "ناقش فقط مع مجتمع طلاب كلية السعيد للهندسة وتقنية المعلومات حتى تحصل على إجابات أكثر تحديداً. يمكنك المشاركة في مناقشات موجودة من خلال كتابة تعليقات، أو إنشاء مناقشة جديدة.",
    imageSrc: "/features/discuss.webp",
    imageAlt: "Students discussing feature illustration",
  },
  {
    title: "صوّت للمحتوى",
    description: "يمكنك التصويت إيجاباً أو سلباً على النقاشات أو التعليقات.",
    imageSrc: "/features/vote.webp",
    imageAlt: "Content voting feature illustration",
  },
  {
    title: "تنسيق Markdown مدعوم",
    description: "محتوى النقاشات والتعليقات يدعم تنسيق Markdown بما في ذلك تنسيق النصوص وإضافة الصور المضمنة.",
    imageSrc: "/features/markdown.webp",
    imageAlt: "Markdown support feature illustration",
  },
  {
    title: "استعرض وساهم",
    description: "استعرض جميع النقاشات المفتوحة والمساهمة في النقاشات التي تهم أو لديك خبرة فيها. يمكنك طلب المساعدة الأكاديمية من زملائك.",
    imageSrc: "/features/explore.webp",
    imageAlt: "Explore and contribute feature illustration",
  }
];

function Features() {
  return (
    <Container medium>
      <section className="flex flex-col gap-16 py-16">
        {features.map((feature, index) => (
          <Card
            key={index}
            {...feature}
            contentFirst={index % 2 !== 0}
          />
        ))}
      </section>
    </Container>
  );
}

export default Features;
