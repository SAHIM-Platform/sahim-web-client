export const currentUser = {
  id: 1,
  name: "أحمد محمد",
  avatar: "https://ui-avatars.com/api/?name=محمد+أحمد&background=0c1823&color=ffffff",
}

export const unreadNotifications = 8;

export const categories = [
  { id: "tech", name: "التقنية" },
  { id: "design", name: "التصميم" },
  { id: "development", name: "البرمجة" },
  { id: "ai", name: "الذكاء الاصطناعي" },
  { id: "business", name: "الأعمال" },
];

export const discussionThreads = [
  {
    id: "1",
    author: {
      name: "أحمد محمد",
      avatar: "https://ui-avatars.com/api/?name=Ahmed+Mohammed&background=random",
    },
    title: "مرحباً بالجميع! هل يمكننا مناقشة المشروع الجديد؟",
    timestamp: "منذ 5 دقائق",
    likesCount: 12,
    repliesCount: 3,
    isLiked: false,
    category: categories[3].name,
    content: `دعونا نبدأ مناقشة حول المشروع الجديد ونتبادل الأفكار والآراء لتحقيق أفضل النتائج. في هذه المناقشة، نود أن نناقش ما يلي:
    1. ما هو سبب بدء هذا المشروع؟
    2. ما هو الهدف الرئيسي لهذا المشروع؟
    3. ما هي المخاطر المحتملة لهذا المشروع؟
    4. ما هي الخطوات اللازمة لتحقيق النجاح في هذا المشروع؟
    5. ما هو الدور الذي سيلعبه كل فرد في هذا المشروع؟
    6. ما هي المكاسب المالية لهذا المشروع؟
    7. ما هي المشاكل المحتملة التي ستواجهها في هذا المشروع؟
    8. ما هو الحل الأفضل لهذه المشاكل؟`
  },
  {
    id: "2",
    author: {
      name: "محمد أحمد",
      avatar: "https://ui-avatars.com/api/?name=Mohammed+Ahmed&background=random",
    },
    title: "كيفية تحسين واجهة المستخدم في التطبيقات",
    thumbnail: "https://picsum.photos/id/48/600/400",
    timestamp: "منذ يومين",
    likesCount: 8,
    repliesCount: 5,
    isLiked: false,
    category: categories[1].name,
    content: "أريد معرفة الآراء والتجارب حول تحسين واجهة المستخدم لضمان تجربة أفضل للمستخدمين."
  },
  {
    id: "3",
    author: {
      name: "فاطمة علي",
      avatar: "https://ui-avatars.com/api/?name=Fatima+Ali&background=random",
    },
    title: "أفضل الممارسات لتجربة المستخدم",
    thumbnail: "https://picsum.photos/id/7/600/400",
    timestamp: "منذ 3 أيام",
    likesCount: 15,
    repliesCount: 12,
    isLiked: false,
    category: categories[1].name,
    content: "شاركوني بالممارسات الجيدة التي تساهم في تحسين تجربة المستخدم وجعلها أكثر تفاعلية."
  },
  {
    id: "4",
    author: {
      name: "عمر خالد",
      avatar: "https://ui-avatars.com/api/?name=Omar+Khalid&background=random",
    },
    title: "مناقشة حول تحسين أداء التطبيق",
    timestamp: "منذ 4 أيام",
    likesCount: 10,
    repliesCount: 7,
    isLiked: false,
    category: categories[2].name,
    content: "لنناقش الأساليب الفعالة في تحسين أداء التطبيق وتسريع استجابته للمستخدمين."
  },
];
