'use client'
import Image from 'next/image';
import { useTheme } from "next-themes";

const Logo = () => {
    const { theme: mode } = useTheme();
  return (
    <div>
      <Image
        src={"/LOGO.png"}
        alt=""
        width={300}
        height={300}
        className=" w-65 xl:full"
      />
    </div>
  );
}

export default Logo;