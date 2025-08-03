import { MountainIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md">
      <div className="flex items-center space-x-2">
        <MountainIcon className="h-6 w-6 text-gray-800 dark:text-gray-200" />
        <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">YT & IG Downloader</span>
      </div>
      <ThemeToggle />
    </header>
  );
}