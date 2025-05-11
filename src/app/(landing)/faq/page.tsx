import FaqContent from "@/components/Faq/FaqContent";
import Header from "@/components/Header";

export default function FaqPage() {
  return (
    <>
      <Header
        title="الأسئلة الشائعة حول منصة ساهم"
        description="إليك بعض الأسئلة المتكررة حول منصة ساهم، والتي ستساعدك على فهم كيفية استخدام المنصة، والفوائد التي يمكن أن تحصل عليها من خلالها، بالإضافة إلى إجابات على بعض الأسئلة الشائعة الأخرى."
        button={{
          text: "أنشئ حساب الآن",
          href: "/signup",
        }}
      />
      <FaqContent />
    </>
  )
}