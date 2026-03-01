import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Header – consistent spacing */}
        <header className="text-center mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            Join StudyBuddy
          </h1>
          <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
            Create your account and start learning today
          </p>
        </header>

        {/* Card – symmetric padding, centered */}
        <main className="w-full">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6 sm:p-8">
            <SignUp
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-transparent shadow-none w-full",
                  cardBox: "w-full",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton:
                    "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl transition-colors duration-200",
                  formButtonPrimary:
                    "bg-[#1e3a8a] hover:bg-[#1e293b] text-white font-semibold py-3 rounded-xl transition-colors duration-200",
                  formFieldInput:
                    "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent transition-all duration-200",
                  footerActionLink:
                    "text-[#1e3a8a] hover:text-[#1e293b] font-medium transition-colors duration-200",
                  identityPreviewText: "text-gray-900 dark:text-white",
                  formFieldLabel: "text-gray-700 dark:text-gray-300 font-medium",
                  dividerLine: "bg-gray-200 dark:bg-slate-700",
                  dividerText: "text-gray-500 dark:text-gray-400",
                },
              }}
            />
          </div>
        </main>

        {/* Footer – same spacing as header */}
        <footer className="text-center mt-10 sm:mt-12">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <a
              href="/sign-in"
              className="text-[#1e3a8a] hover:text-[#1e293b] font-semibold transition-colors duration-200"
            >
              Sign in
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
