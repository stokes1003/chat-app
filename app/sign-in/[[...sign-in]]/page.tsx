import { SignIn } from '@clerk/nextjs';
import { FaRobot } from 'react-icons/fa';

export default function Page() {
  return (
    <div className=" min-h-screen flex flex-col items-center justify-center ">
      <SignIn />
    </div>
  );
}
