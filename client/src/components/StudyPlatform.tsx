"use client"

import Image from "next/image"
import { Button } from "./ui/button"
import LoginModal from "./LoginModal"
import SignupModal from "./SignupModal"
import { useState } from "react"

export default function StudyPlatform() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const openSignupModal = () => setIsSignupModalOpen(true);
  const closeSignupModal = () => setIsSignupModalOpen(false);

  const switchToSignup = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };

  const switchToLogin = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFF1E8" }}>
      {/* Header */}
      <header className="flex justify-end items-center p-4 absolute top-0 right-0 z-20" style={{ backgroundColor: "transparent" }}>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="px-6 py-2 rounded-md border-2 bg-transparent"
            style={{
              borderColor: "#829577",
              color: "#50614A",
              backgroundColor: "transparent",
            }}
            onClick={openLoginModal}
          >
            Login
          </Button>
          <button className="p-2">
            <Image src="/hamburger.svg" alt="Menu" width={35} height={32} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative min-h-screen flex items-center">
        {/* Content Container */}
        <div className="w-full max-w-7xl mx-auto px-4">
          {/* Hero Section with Illustration */}
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Text Content positioned on the right */}
            <div className="flex-1 text-center lg:text-left z-10 order-2 lg:order-1">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight" style={{ color: "#000000" }}>
                  NeuraNote
                </h1>

                <p className="text-lg lg:text-xl font-medium" style={{ color: "#50614A" }}>
                  Studying Simplified
                </p>

                <div className="pt-4">
                  <Button
                    className="px-8 py-3 text-lg font-medium rounded-full border-2"
                    style={{
                      backgroundColor: "#CA8C71",
                      borderColor: "#CA8C71",
                      color: "#000000",
                    }}
                    onClick={openSignupModal}
                  >
                    start your journey
                  </Button>
                </div>
              </div>
            </div>

            {/* Table Illustration - positioned on the left */}
            <div className="flex-1 flex justify-center lg:justify-start order-1 lg:order-2">
              <div className="max-w-lg">
                <Image
                  src="/table.png"
                  alt="Study workspace illustration"
                  width={550}
                  height={660}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Additional Scrollable Content */}
          <div className="mt-20 space-y-16">
            {/* Features Section */}
            <section className="text-left">
              <h2 className="text-4xl font-bold mb-8" style={{ color: "#50614A" }}>
                Why Choose Our Platform?
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="p-6 rounded-lg" style={{ backgroundColor: "#E8F5E8" }}>
                  <h3 className="text-xl font-semibold mb-4" style={{ color: "#000000", fontWeight: "700" }}>
                    Personalized Learning
                  </h3>
                  <p style={{ color: "#000000", fontWeight: "500" }}>Tailored study plans that adapt to your learning style and pace.</p>
                </div>
                <div className="p-6 rounded-lg" style={{ backgroundColor: "#D4E6D4" }}>
                  <h3 className="text-xl font-semibold mb-4" style={{ color: "#000000", fontWeight: "700" }}>
                    Smart Analytics
                  </h3>
                  <p style={{ color: "#000000", fontWeight: "500" }}>
                    Track your progress with detailed insights and performance metrics.
                  </p>
                </div>
                <div className="p-6 rounded-lg" style={{ backgroundColor: "#E0E8E0" }}>
                  <h3 className="text-xl font-semibold mb-4" style={{ color: "#000000", fontWeight: "700" }}>
                    Interactive Content
                  </h3>
                  <p style={{ color: "#000000", fontWeight: "500" }}>Engage with dynamic materials designed to enhance retention.</p>
                </div>
              </div>
            </section>

            {/* About Section */}
            <section className="text-left max-w-4xl">
              <h2 className="text-4xl font-bold mb-8" style={{ color: "#50614A" }}>
                Transform Your Study Experience
              </h2>
              <p className="text-lg leading-relaxed mb-6" style={{ color: "#000000" }}>
                Our platform combines cutting-edge AI technology with proven learning methodologies to create a study
                environment that's both effective and enjoyable. Whether you're preparing for exams, learning new
                skills, or advancing your career, we provide the tools you need to succeed.
              </p>
              <p className="text-lg leading-relaxed" style={{ color: "#000000" }}>
                Join thousands of students who have already transformed their learning journey with our innovative
                approach to education.
              </p>
            </section>

            {/* CTA Section */}
            <section className="text-center py-8">
              <h2 className="text-4xl font-bold mb-8" style={{ color: "#50614A" }}>
                Ready to Get Started?
              </h2>
              <Button
                className="px-12 py-4 text-xl font-medium rounded-full border-2"
                style={{
                  backgroundColor: "#CA8C71",
                  borderColor: "#CA8C71",
                  color: "#000000",
                }}
                onClick={openLoginModal}
              >
                Begin Your Journey Today
              </Button>
            </section>

            {/* Footer */}
            <section className="text-center py-4">
              <p 
                className="text-sm font-medium"
                style={{ color: "#50614A" }}
              >
                Made with love ❤️ by the COSMIC BUGSLAYERS
              </p>
            </section>
          </div>
        </div>
      </main>
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={closeLoginModal}
        onSwitchToSignup={switchToSignup}
      />
      
      {/* Signup Modal */}
      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={closeSignupModal}
        onSwitchToLogin={switchToLogin}
      />
    </div>
  )
} 