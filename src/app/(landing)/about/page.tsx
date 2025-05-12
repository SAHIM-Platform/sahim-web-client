import Features from "@/components/About/Features";
import Header from "@/components/Header";

export default function AboutPage() {
  return (
    <>
      <Header
        title="مرحبًا بك في منصة ساهم"
        description="ساهم هي منصة تفاعلية مخصصة لطلاب كلية الهندسة وتقنية المعلومات بجامعة تعز، حيث نهدف إلى تسهيل التواصل الأكاديمي، تبادل المعرفة، ومساعدة الطلاب على النجاح في مسيرتهم الدراسية."
      />
      <Features />
    </>
  )
}