import Image from "next/image";
import { Nav } from "./nav";
import { User } from "./user";

export default function Header() {
  return (
    <header className="flex justify-between items-center w-full py-4 mx-auto max-w-7xl px-4 2xl:px-0 pt-4">
      <div className="flex items-center">
        <Image src="/logo-amarela.png" alt="Logo" width={180} height={180} 
        className="lg:w-full w-1/2"
        
        />
      </div>
      <Nav />
      <div className="flex items-center">
        <User />
      </div>
    </header>
  );
}