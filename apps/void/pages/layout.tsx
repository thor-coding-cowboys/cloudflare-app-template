import { Logout01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useRouter, useShared } from "@void/react";
import type { ReactNode } from "react";
import { auth } from "void/client";
import { ThemeSwitcher } from "../src/components/theme-switcher";
import { Button, buttonVariants } from "../src/components/ui/button";
import "../src/styles.css";

export default function Layout({ children }: { children: ReactNode }) {
	const { auth: shared } = useShared();
	const router = useRouter();
	const user = shared.user;

	async function signOut() {
		await auth.signOut();
		await router.visit("/");
	}

	return (
		<div className="flex min-h-svh flex-col">
			<header className="bg-background/80 sticky top-0 z-50 border-b backdrop-blur-sm">
				<div className="mx-auto flex h-12 w-full max-w-5xl items-center justify-between gap-4 px-4">
					<Link href="/" className="font-heading text-sm font-medium">
						Void Todos
					</Link>
					<nav className="flex items-center gap-2">
						{user ? (
							<>
								<span className="text-muted-foreground hidden max-w-48 truncate text-xs sm:inline">
									{user.email}
								</span>
								<Button variant="outline" size="sm" onClick={signOut}>
									<HugeiconsIcon icon={Logout01Icon} />
									Sign out
								</Button>
							</>
						) : (
							<>
								<Link href="/sign-in" className={buttonVariants({ variant: "ghost", size: "sm" })}>
									Sign in
								</Link>
								<Link href="/sign-up" className={buttonVariants({ size: "sm" })}>
									Get started
								</Link>
							</>
						)}
						<ThemeSwitcher />
					</nav>
				</div>
			</header>
			<main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">{children}</main>
		</div>
	);
}
