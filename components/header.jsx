import { SignInButton, SignedOut, UserButton, SignedIn } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button"
import { BarChart2Icon, Heading, LayoutDashboard, PenBox, Text } from "lucide-react"
import { checkUser } from "@/lib/checkUser"

const Header = async () => {
  await checkUser();
  return (
    <div className="fixed flex top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/">
            {/*<Image src={'logo.svg'}
            alt="logo"
            width={200}
            height={60} 
            className="h-12 w-auto object-contain"/>*/}
            <div className="flex shadow-lg items-center gap-2 w-[210px] rounded-full p-1">
            <BarChart2Icon className="text-blue-700 animate-pulse" size={50}/>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-700 to-blue-400 bg-clip-text text-transparent animate-pulse tracking-wider">TRAF</h1>
            </div>
            </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <SignedIn>
            <Link href={"/dashboard"}
            className="text-gray-800 hover:text-blue-400 flex item-center">
            <Button variant="outline" className="">
              <LayoutDashboard size={18}/>
                <span className="hidden md:inline">Dashboard</span>
            </Button>
            </Link>

            <Link href={"/transaction/create"}>
            <Button className="flex items-center">
              <PenBox size={18}/>
                <span className="hidden md:inline">Add Transaction</span>
            </Button>
            </Link>
          </SignedIn>
       <SignedOut>
       <SignInButton forceRedirectUrl="/dashboard">
          <Button variant="outline">Login</Button>
          </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton appearance={{elements:{avatarBox:"w-10 h-10"}}}/>
          </SignedIn>
          </div>
    </div>
  )
}

export default Header
