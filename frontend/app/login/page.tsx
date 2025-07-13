import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="h-screen flex items-center bg-background">
      <div className="lg:w-1/2 w-[90%] mx-auto">
        <div className="lg:w-[500px] w-full mx-auto rounded-xl shadow-lg flex flex-col gap-4">
          <h1 className="text-title text-2xl font-bold">
            Log in to your account
          </h1>
          <p className="text-body">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-primary font-medium hover:underline">
              Register Now
            </a>
          </p>
          <form className="flex flex-col gap-4">
            <div>
              <label className="block text-body" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full p-3 rounded border border-border bg-background text-foreground placeholder:text-body focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Email"
              />
            </div>
            <div>
              <label className="block text-body" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full p-3 rounded border border-border bg-background text-foreground placeholder:text-body focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Password"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-body">
                <input type="checkbox" className="accent-primary rounded" />
                Remember Me
              </label>
              <a href="#" className="text-body hover:underline">
                Forgot Password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-primary cursor-pointer hover:bg-primary-hover transition-all duration-300 text-white font-semibold py-3 rounded"
            >
              Sign in
            </button>
          </form>
          <div className="flex flex-col gap-2">
            <div className="flex items-center mt-6">
              <div className="flex-grow border-t border-border" />
              <span className="mx-4 text-body text-sm">Or continue with</span>
              <div className="flex-grow border-t border-border" />
            </div>
            <div className="flex gap-3">
              <button className="w-full flex items-center justify-center bg-background border border-border rounded py-2 text-body font-medium hover:bg-[#222] transition-colors cursor-pointer">
                <Image alt="Google Logo" width={36} height={36} src="/Google.svg"/> Google
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/2 h-screen relative lg:block hidden">
        <Image
          src="/login-image.jpg"
          alt="Login illustration"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
