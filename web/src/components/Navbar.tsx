import { Button } from "./ui/button";
import Link from "next/link";
import { getServerSession } from "next-auth";
import SignOutButton from "./SignOutButton";

export default async function Navbar() {
  const session = await getServerSession();

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/" className="font-bold text-xl">
          CodeJudge
        </Link>

        <div className="ml-auto flex items-center space-x-4">
          {session ? (
            <>
              <span className="text-sm">{session.user?.name}</span>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}