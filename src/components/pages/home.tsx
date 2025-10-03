import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronRight,
  Settings,
  User,
  MapPin,
  Receipt,
  PieChart,
  FileText,
  Calendar,
  DollarSign,
  Upload,
  BarChart3,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";

export default function LandingPage() {
  const { user, signOut } = useAuth();

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Apple-style navigation */}
      <header className="fixed top-0 z-50 w-full bg-[rgba(255,255,255,0.8)] backdrop-blur-md border-b border-[#f5f5f7]/30">
        <div className="max-w-[980px] mx-auto flex h-12 items-center justify-between px-4">
          <div className="flex items-center">
            <Link to="/" className="font-medium text-xl">
              TripExpense Manager
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <Button
                    variant="ghost"
                    className="text-sm font-light hover:text-gray-500"
                  >
                    Dashboard
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 hover:cursor-pointer">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                        alt={user.email || ""}
                      />
                      <AvatarFallback>
                        {user.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="rounded-xl border-none shadow-lg"
                  >
                    <DropdownMenuLabel className="text-xs text-gray-500">
                      {user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onSelect={() => signOut()}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-sm font-light hover:text-gray-500"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="rounded-full bg-black text-white hover:bg-gray-800 text-sm px-4">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="pt-12">
        {/* Hero section */}
        <section className="py-20 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-6xl font-semibold tracking-tight mb-4">
              Track Your Travel Expenses
            </h1>
            <h2 className="text-2xl font-medium text-gray-500 mb-8">
              Manage your trip budgets across accommodation, travel, food &
              other expenses with ease.
            </h2>
            <div className="flex justify-center space-x-6 text-xl text-blue-600 mb-12">
              <Link to="/signup" className="flex items-center hover:underline">
                Start tracking <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                to="#features"
                className="flex items-center hover:underline"
              >
                Learn more <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Hero visual */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 max-w-3xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <MapPin className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">
                    Accommodation
                  </div>
                  <div className="text-xs text-gray-500">$800 / $1000</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <Calendar className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">
                    Travel
                  </div>
                  <div className="text-xs text-gray-500">$450 / $600</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <Receipt className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">Food</div>
                  <div className="text-xs text-gray-500">$320 / $400</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <DollarSign className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">Other</div>
                  <div className="text-xs text-gray-500">$180 / $200</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  Total Spent: $1,750 / $2,200
                </div>
                <div className="text-sm text-green-600 font-medium">
                  $450 under budget
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section id="features" className="py-20 bg-[#f5f5f7] text-center">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-5xl font-semibold tracking-tight mb-4">
              Everything You Need
            </h2>
            <h3 className="text-2xl font-medium text-gray-500 mb-12">
              Comprehensive expense tracking for your travels
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm text-left">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="text-xl font-medium mb-2">Trip Creation</h4>
                <p className="text-gray-500">
                  Create trips with custom budgets across four expense
                  categories.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm text-left">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Receipt className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="text-xl font-medium mb-2">Expense Entry</h4>
                <p className="text-gray-500">
                  Add expenses with receipts, automatic timestamps, and
                  categorization.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm text-left">
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <PieChart className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="text-xl font-medium mb-2">Budget Tracking</h4>
                <p className="text-gray-500">
                  Visual representation of spending vs. budget with real-time
                  updates.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm text-left">
                <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
                <h4 className="text-xl font-medium mb-2">Data Export</h4>
                <p className="text-gray-500">
                  Export trip data to Excel and manage your expense history.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed features section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-semibold tracking-tight mb-4">
              Smart Budget Management
            </h2>
            <h3 className="text-xl font-medium text-gray-600 mb-6">
              Allocate and track across four categories
            </h3>
            <div className="flex justify-center space-x-6 text-lg text-blue-600 mb-8">
              <Link to="/signup" className="flex items-center hover:underline">
                Start budgeting <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm max-w-sm mx-auto">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Accommodation</span>
                  <span className="text-sm text-blue-600">80%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: "80%" }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Food</span>
                  <span className="text-sm text-green-600">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "65%" }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Travel</span>
                  <span className="text-sm text-orange-600">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-semibold tracking-tight mb-4">
              Receipt Management
            </h2>
            <h3 className="text-xl font-medium text-gray-600 mb-6">
              Upload and organize all your receipts
            </h3>
            <div className="flex justify-center space-x-6 text-lg text-green-600 mb-8">
              <Link to="/signup" className="flex items-center hover:underline">
                Try it now <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm max-w-sm mx-auto">
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Drop receipt here</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                    <Receipt className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">hotel_receipt.jpg</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                    <Receipt className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">dinner_bill.pdf</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-black text-white text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-5xl font-semibold tracking-tight mb-4">
              Ready to Track Your Expenses?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of travelers who trust TripExpense Manager for
              their budget tracking needs.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/signup">
                <Button className="rounded-full bg-white text-black hover:bg-gray-100 text-lg px-8 py-3 h-auto">
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="outline"
                  className="rounded-full border-white text-white hover:bg-white hover:text-black text-lg px-8 py-3 h-auto"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#f5f5f7] py-12 text-xs text-gray-500">
        <div className="max-w-[980px] mx-auto px-4">
          <div className="border-b border-gray-300 pb-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-4">
                TripExpense Manager
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:underline">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Examples
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-4">
                Resources
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:underline">
                    Getting Started
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    User Guide
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Tips & Tricks
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-4">
                Support
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:underline">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Community
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Status
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:underline">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="py-4">
            <p>Copyright © 2025 TripExpense Manager. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
