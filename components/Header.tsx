import { SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { FaRobot } from 'react-icons/fa';
import Link from 'next/link';

function Header() {
  return (
    <div className="mx-4">
      <div className="rounded inline-flex flex-row-reverse w-full place-content-between">
        <div className="flex mx-1 content-center py-1">
          <UserButton />
        </div>
        <div id="buttons" className="py-1">
          <SignedOut>
            <button className="ring-2 ring-stokes-accent  mx-1 outline-stokes-accent font-medium hover:ring-stokes-accent-dark text-stokes-accent hover:text-stokes-accent-dark h-7 w-20 rounded">
              Sign Up
            </button>
            <button className="bg-stokes-accent mx-1 hover:bg-stokes-accent-dark font-medium text-stokes-primary hover:text-stokes-primary-dark h-8 w-20 rounded">
              <SignInButton />
            </button>
          </SignedOut>
        </div>
        <Link href="/chat" className="content-center">
          <div className="inline-flex gap-1 items-center pl-4">
            <div className=" inline-flex gap-0">
              <h1 className="text-stokes-secondary font-light">Turbo</h1>
              <h1 className="text-stokes-secondary font-bold">Robot</h1>
            </div>
            <FaRobot color="#5e69ee" />
          </div>
        </Link>
      </div>
    </div>
  );
}
export default Header;
