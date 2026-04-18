import CustomButton from "@/shared/CustomButton";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <header className="w-full bg-[#f8f8fd]">
      <div className="container-layout">
        <nav className="flex justify-between items-center py-5">
          <div className="text-xl font-bold text-dark-text flex items-center gap-12">
            <Link href={`/`}>
              <Image
                src="/images/Logo-blk.png"
                alt="Logo"
                width={152}
                height={36}
                priority
              />
            </Link>
            <ul className="flex space-x-10 text-md font-normal font-epilogue mt-2">
              <li>
                <Link
                  href="/jobs"
                  className=" text-primary-gray hover:text-dark-text"
                >
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-primary-gray hover:text-dark-text"
                >
                  Browse Companies
                </Link>
              </li>
            </ul>
          </div>
          <div className="divide-x-2 divide-gray-300 space-x-3 font-epilogue">
            <CustomButton
              label="Login"
              className="bg-white text-indigoTags font-bold"
            />
            <CustomButton
              label="Sign Up"
              className="bg-indigoTags text-white font-bold"
            />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
