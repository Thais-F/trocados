import { auth } from "@/auth";
import { CategoriesPanel } from "@/components/CategoriesPanel";
import { AppHeader } from "@/components/AppHeader";

export default async function CategoriesPage() {
  const session = await auth();

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-10 sm:py-16">
      <div className="flex w-full max-w-2xl flex-col gap-8">
        <AppHeader userName={session?.user?.name} active="categories" />
        <CategoriesPanel />
      </div>
    </div>
  );
}
