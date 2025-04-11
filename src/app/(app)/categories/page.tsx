import CategoriesListing from "@/components/app/CategoriesListing";

export default function CategoriesPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold">
          جميع التصنيفات
        </h1>
        <p className="mt-2 text-xs sm:text-sm lg:text-base text-gray-500">
          تصفّح جميع تصنيفات المناقشات المتاحة
        </p>
      </div>
      <CategoriesListing allowManagement />
    </div>
  );
}
