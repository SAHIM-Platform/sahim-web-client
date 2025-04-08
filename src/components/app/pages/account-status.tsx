import from react;
export default function AccountStatusPage() {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-8 text-center rtl">
        {/* الشعار */}
        <div className="mb-10">
          <img src="sahim-web-client\public\sahim-logo.png" alt="Logo" className="mx-auto w-12 h-12" />
          <p className="mt-2 text-sm text-gray-700 font-medium">ساهم</p>
        </div>
  
        {/* صندوق الحالة */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 w-full max-w-md shadow-sm">
          <div className="flex flex-col items-center space-y-2">
            <div className="text-blue-500 text-2xl">i</div>
            <p className="text-gray-500 text-sm">حالة الحساب</p>
            <h1 className="text-lg font-semibold text-gray-800">تم قبول طلب تسجيل حساب</h1>
          </div>
        </div>
  
        {/* الزر والرابط */}
        <div className="mt-6 flex flex-col items-center space-y-2">
          <a
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm transition"
          >
            المتابعة إلى الصفحة الرئيسية
          </a>
          <p className="text-sm text-gray-600">
            هل واجهتك مشكلة؟{' '}
            <a href="/support" className="text-blue-500 hover:underline">
              تواصل مع الدعم الفني
            </a>
          </p>
        </div>
      </div>
    );
  }