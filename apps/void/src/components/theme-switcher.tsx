import { ComputerIcon, Moon02Icon, Sun01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export const THEME_STORAGE_KEY = "theme";

type Theme = "light" | "dark" | "system";

/** Kept in sync with the pre-paint script in `middleware/01.shared.ts`. */
export function applyTheme(theme: Theme) {
	const dark =
		theme === "dark" ||
		(theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
	document.documentElement.classList.toggle("dark", dark);
}

export function ThemeSwitcher() {
	const [theme, setTheme] = useState<Theme>("system");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		const stored = localStorage.getItem(THEME_STORAGE_KEY);
		setTheme(stored === "light" || stored === "dark" ? stored : "system");
		setMounted(true);
	}, []);

	function cycle() {
		const next: Theme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
		setTheme(next);
		if (next === "system") localStorage.removeItem(THEME_STORAGE_KEY);
		else localStorage.setItem(THEME_STORAGE_KEY, next);
		applyTheme(next);
	}

	if (!mounted) {
		// Same footprint as the button, but not focusable before the theme is known.
		return <div className="size-8" aria-hidden />;
	}

	const label =
		theme === "light"
			? "Switch to dark mode"
			: theme === "dark"
				? "Switch to system mode"
				: "Switch to light mode";

	return (
		<Button size="icon" variant="ghost" onClick={cycle} aria-label={label} title={label}>
			<HugeiconsIcon
				icon={theme === "light" ? Sun01Icon : theme === "dark" ? Moon02Icon : ComputerIcon}
			/>
		</Button>
	);
}
