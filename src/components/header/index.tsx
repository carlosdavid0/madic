import Image from "next/image";
import { Nav } from "./nav";
import { User } from "./user";

export default function Header() {
  return (
    <header className="flex justify-between items-center w-full py-4">
      <div className="flex items-center">
        <Image src="/logo-amarela.png" alt="Logo" width={180} height={180} />
      </div>
      <Nav />
      <div className="flex items-center">
        <User />
      </div>
    </header>
  );
}