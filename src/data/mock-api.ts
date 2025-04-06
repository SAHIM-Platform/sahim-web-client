import { ThreadItemProps } from "@/components/app/ThreadListing/ThreadItem";

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

export const discussionThreads: ThreadItemProps[] = [
  {
    id: "1",
    author: {
      name: "أحمد محمد",
      avatar: "https://ui-avatars.com/api/?name=Ahmed+Mohammed&background=random",
    },
    title: "مرحباً بالجميع! هل يمكننا مناقشة المشروع الجديد؟",
    timestamp: "منذ 5 دقائق",
    votesCount: 12,
    repliesCount: 3,
    userVote: null,
    category: categories[3].name,
    content: `
  # مشروع إدارة المخزون - Inventory Management System

  ## مقدمة
  
  مشروع **Inventory Management System** هو تطبيق مبتكر يهدف إلى تبسيط إدارة المخزون في الشركات والمؤسسات. يعتمد المشروع على تقنيات حديثة في البرمجة ويوفر واجهات سهلة الاستخدام لإضافة، تعديل، وحذف العناصر في المخزون بشكل آمن وفعال.
  
  ### التقنيات المستخدمة
  
  - **C#**: اللغة الأساسية لتطوير التطبيق باستخدام **.NET Framework**.
  - **SQL Server**: قاعدة البيانات المستخدمة لتخزين البيانات المتعلقة بالعناصر في المخزون.
  - **Windows Forms**: لبناء واجهات المستخدم التي تتيح التفاعل السهل مع النظام.
  
  ---
  
  ## الميزات الرئيسية
  
  ### إدارة العناصر
  
  يتيح التطبيق للمستخدمين إضافة وتعديل وحذف العناصر في المخزون، مما يسمح بتتبع الكميات المتاحة والعناصر المفقودة.
  
  ### تقارير المخزون
  
  يستطيع المستخدمون توليد تقارير دورية توضح حركة المخزون والمبيعات، بالإضافة إلى تحليل البيانات لتحديد الفجوات أو الفائض في المخزون.
  
  ### تنبيهات المخزون
  
  يتم إرسال تنبيهات عند انخفاض الكميات تحت الحد الأدنى المخطط له، مما يساعد في تجنب نفاد المخزون.
  
  ---
  
  ## روابط مهمة
  
  - رابط إلى [الموقع الرسمي لمشروع Inventory Management System](https://github.com/InventoryManagementSystem).
  - رابط إلى [التوثيق](https://github.com/InventoryManagementSystem/docs).
  
  ---
  
  ## القوائم
  
  ### قائمة الميزات:
  
  - إضافة العناصر إلى المخزون.
  - تعديل بيانات العناصر مثل السعر والكميات.
  - إنشاء تقارير حركة المخزون.
  - تنبيهات انخفاض المخزون.
  
  ### مراحل التطوير:
  
  1. بناء قاعدة البيانات.
  2. تطوير واجهات المستخدم باستخدام Windows Forms.
  3. تطوير نظام التنبيهات.
  4. اختبار التطبيق وتحسين الأداء.
  
  ---
  
  ## مثال على كود مضمن
  
  \`\`\`csharp
  Console.WriteLine("Adding item: " + name + " Quantity: " + quantity + " Price: " + price);
  \`\`\`
  `,
    comments: [
      {
        id: "1",
        author: {
          name: "محمد أحمد",
          avatar: "https://ui-avatars.com/api/?name=Mohammed+Ahmed&background=random",
        },
        likesCount: 12,
        timestamp: "منذ 5 دقائق",
        isLiked: false,
        content: "هذه مناقشة رائعة! أتمنى أن نستفيد من تجارب الآخرين في هذا المشروع.",
      },
      {
        id: "2",
        author: {
          name: "فاطمة علي",
          avatar: "https://ui-avatars.com/api/?name=Fatima+Ali&background=random",
        },
        likesCount: 8,
        timestamp: "منذ 5 دقائق",
        isLiked: false,
        content: "أنا متحمسة لبدء هذا المشروع! أتمنى أن نناقش المخاطر المحتملة.",
      },
      {
        id: "3",
        author: {
          name: "عمر خالد",
          avatar: "https://ui-avatars.com/api/?name=Omar+Khalid&background=random",
        },
        likesCount: 10,
        timestamp: "منذ 5 دقائق",
        isLiked: false,
        content: "أنا أتفق معك في أننا يجب أن نناقش المخاطر المحتملة. أتمنى أن نناقش أيضاً الخطوات اللازمة لتحقيق النجاح.",
      },
    ]
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
    votesCount: 8,
    repliesCount: 5,
    userVote: null,
    category: categories[1].name,
    content: "أريد معرفة الآراء والتجارب حول تحسين واجهة المستخدم لضمان تجربة أفضل للمستخدمين.",
    comments: [
      {
        id: "1",
        author: {
          name: "محمد أحمد",
          avatar: "https://ui-avatars.com/api/?name=Mohammed+Ahmed&background=random",
        },
        likesCount: 12,
        timestamp: "منذ 5 دقائق",
        isLiked: false,
        content: "أنا متحمس لهذا الموضوع! أتمنى أن نناقش المزيد من الأفكار والتجارب.",
      },
      {
        id: "2",
        author: {
          name: "فاطمة علي",
          avatar: "https://ui-avatars.com/api/?name=Fatima+Ali&background=random",
        },
        likesCount: 8,
        timestamp: "منذ 5 دقائق",
        isLiked: false,
        content: "أنا أيضاً متحمسة لهذا الموضوع! أتمنى أن نناقش كيفية تطبيق هذه الأفكار في المشاريع الحقيقية.",
      },
    ]
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
    votesCount: 15,
    repliesCount: 12,
    userVote: null,
    category: categories[1].name,
    content: "شاركوني بالممارسات الجيدة التي تساهم في تحسين تجربة المستخدم وجعلها أكثر تفاعلية.",
    comments: [
      {
        id: "1",
        author: {
          name: "محمد أحمد",
          avatar: "https://ui-avatars.com/api/?name=Mohammed+Ahmed&background=random",
        },
        likesCount: 12,
        timestamp: "منذ 5 دقائق",
        isLiked: false,
        content: "أنا متحمس لهذا الموضوع! أتمنى أن نناقش المزيد من الأفكار والتجارب.",
      },
      {
        id: "2",
        author: {
          name: "فاطمة علي",
          avatar: "https://ui-avatars.com/api/?name=Fatima+Ali&background=random",
        },
        likesCount: 8,
        timestamp: "منذ 5 دقائق",
        isLiked: false,
        content: "أنا أيضاً متحمسة لهذا الموضوع! أتمنى أن نناقش كيفية تطبيق هذه الأفكار في المشاريع الحقيقية.",
      },
    ]
  },
  {
    id: "4",
    author: {
      name: "عمر خالد",
      avatar: "https://ui-avatars.com/api/?name=Omar+Khalid&background=random",
    },
    title: "مناقشة حول تحسين أداء التطبيق",
    timestamp: "منذ 4 أيام",
    votesCount: 10,
    repliesCount: 7,
    userVote: null,
    category: categories[2].name,
    content: "لنناقش الأساليب الفعالة في تحسين أداء التطبيق وتسريع استجابته للمستخدمين.",
    comments: [
      {
        id: "1",
        author: {
          name: "محمد أحمد",
          avatar: "https://ui-avatars.com/api/?name=Mohammed+Ahmed&background=random",
        },
        likesCount: 12,
        timestamp: "منذ 5 دقائق",
        isLiked: false,
        content: "أنا متحمس لهذا الموضوع! أتمنى أن نناقش المزيد من الأفكار والتجارب.",
      },
      {
        id: "2",
        author: {
          name: "فاطمة علي",
          avatar: "https://ui-avatars.com/api/?name=Fatima+Ali&background=random",
        },
        likesCount: 8,
        timestamp: "منذ 5 دقائق",
        isLiked: false,
        content: "أنا أيضاً متحمسة لهذا الموضوع! أتمنى أن نناقش كيفية تطبيق هذه الأفكار في المشاريع الحقيقية.",
      },
    ]
  },
];
