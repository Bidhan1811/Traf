import { SignInButton, SignedOut, UserButton, SignedIn } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button"
import { BarChart2Icon, Heading, LayoutDashboard, PenBox, Text } from "lucide-react"
import { checkUser } from "@/lib/checkUser"
import AnimatedHeader from "./animated-header"

const Header = async () => {
  await checkUser();
  return <AnimatedHeader />
}

export default Header
