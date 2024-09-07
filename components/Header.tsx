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
        <div id="buttons" className="py-1"></div>
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
