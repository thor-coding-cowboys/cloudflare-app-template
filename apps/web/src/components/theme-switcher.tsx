import { ComputerIcon, Moon02Icon, Sun01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<Button size="icon" variant="ghost" className="h-8 w-8">
				<div className="h-4 w-4" />
			</Button>
		);
	}

	const cycleTheme = () => {
		if (theme === "light") {
			setTheme("dark");
		} else if (theme === "dark") {
			setTheme("system");
		} else {
			setTheme("light");
		}
	};

	const getAriaLabel = () => {
		if (theme === "light") return "Switch to dark mode";
		if (theme === "dark") return "Switch to system mode";
		return "Switch to light mode";
	};

	const showSun = theme === "light";
	const showMoon = theme === "dark";
	const showComputer = theme === "system";

	return (
		<Button
			size="icon"
			variant="ghost"
			onClick={cycleTheme}
			className="h-8 w-8 relative overflow-hidden"
			aria-label={getAriaLabel()}
		>
			<div className="relative h-4 w-4">
				<HugeiconsIcon
					icon={Sun01Icon}
					className={`absolute inset-0 h-4 w-4 transition-all duration-300 ${
						showSun ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"
					}`}
				/>
				<HugeiconsIcon
					icon={Moon02Icon}
					className={`absolute inset-0 h-4 w-4 transition-all duration-300 ${
						showMoon
							? "rotate-0 scale-100 opacity-100"
							: showSun
								? "-rotate-90 scale-0 opacity-0"
								: "rotate-90 scale-0 opacity-0"
					}`}
				/>
				<HugeiconsIcon
					icon={ComputerIcon}
					className={`absolute inset-0 h-4 w-4 transition-all duration-300 ${
						showComputer ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"
					}`}
				/>
			</div>
		</Button>
	);
}
