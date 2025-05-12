import HeroSection from "@/components/hero";
import { Button } from "@/components/ui/button";
import { featuresData, howItWorksData, statsData, testimonialsData } from "@/data/landing";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";


export default function Home() {
  return (
      <div>
        <HeroSection />

        <section className="py-20 bg-orange-50 mt-12">
          <div className="conatainer mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {statsData.map((statsData,index)=>(
                <div key={index} className="text-center px-4 py-10 shadow-lg zoom-hover zoom-hover:hover">
                  <div className="text-4xl font-bold mb-2 text-orange-900">{statsData.value}</div>
                  <div className="text-xl font-semibold">{statsData.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto container">
              <h2 className="text-5xl font-extrabold text-center mb-12 gradient-title">Everything You need to manage your finances</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuresData.map((features,index)=>(
                  <Card key={index} className="p-6 zoom-hover zoom-hover:hover">
                  <CardContent className="space-y-2 pt-2 ">
                    <div className="text-blue-800">{features.icon}</div>
                    <h3 className="text-xl font-bold text-blue-700">{features.title}</h3>
                    <p className="text-md text-gray-500">{features.description}</p>
                  </CardContent>
                </Card>
                ))}
              </div>
          </div>
        </section>

        <section className="py-20 bg-blue-50">
          <div className="mx-auto container">
              <h2 className="text-5xl font-extrabold text-center tracking-tighter mb-12 gradient-title">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {howItWorksData.map((step,index)=>(
                  <div key={index} className="text-center zoom-hover zoom-hover:hover">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">{step.icon}</div>
                    <div className="text-xl font-semibold mb-4">{step.title}</div>
                    <div className="text-gray-600">{step.description}</div>
                  </div>
                 
                ))}
              </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto container overflow-x-auto space-x-4 shrink-0">
              <h2 className="text-5xl font-extrabold text-center tracking-tighter mb-12 gradient-title">Testimonials</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonialsData.map((test,index)=>(
                  <Card key={index} className="p-6">
                  <CardContent className=" pt-4 ">
                    <div className="flex items-center mb-4">
                      <Image src={test.image} 
                        width={40} 
                        height={40} 
                        alt={test.name} 
                        className="rounded-full"
                        />
                   <div className="ml-4">
                    <div className="font-semibold"> {test.name} </div>
                    <div>
                    <div className="font-light"> {test.role} </div>
                    </div>
                    </div>
                    </div>
                    <div className="ml-4">
                    <div className="font-light"> {test.quote}
                    </div>
                    </div>
                    
                  </CardContent>
                </Card>
                ))}
              </div>
          </div>
        </section>

        <section className="bg-blue-600 p-20">
          <div className="container mx-auto px-4 text-center text-white">
          <h3 className="text-center mx-auto font-semibold text-3xl text-white mb-3">Ready to take control of your wealth?</h3>
          <p className=" text-xl font-extralight mb-8 max-w-2xl mx-auto">Join Traf and Manage Your Finances smartly</p>
          <Link href="/dashboard">
          <Button variant="secondary" size="lg" className="animate-bounce text-blue-600 hover:bg-blue-100">Start Free</Button>
          </Link>
          </div>
        </section>
      </div>
  )
}