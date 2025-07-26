"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.firstName,
            surname: form.lastName,
            email: form.email,
            password: form.password,
            confirmPassword: form.confirmPassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed.");
        setLoading(false);
        return;
      }

      setSuccess(
        "Registration successful! Please check your email to verify your account."
      );
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      router.push("/verify-email"); 
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center bg-background">
      <div className="lg:w-1/2 w-[90%] mx-auto">
        <div className="lg:w-[500px] w-full mx-auto rounded-xl shadow-lg flex flex-col gap-4">
          <h1 className="text-title text-2xl font-bold">
            Register your account
          </h1>
          <p className="text-body">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              Log In Now
            </a>
          </p>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between gap-4">
              <div className="w-[47.5%]">
                <label className="block text-body" htmlFor="firstName">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded border border-border bg-background text-foreground placeholder:text-body focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="w-[47.5%]">
                <label className="block text-body" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded border border-border bg-background text-foreground placeholder:text-body focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-body" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-3 rounded border border-border bg-background text-foreground placeholder:text-body focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-body" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full p-3 rounded border border-border bg-background text-foreground placeholder:text-body focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-body" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full p-3 rounded border border-border bg-background text-foreground placeholder:text-body focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            {error && (
              <div className="text-red-500 font-medium text-sm">{error}</div>
            )}
            <button
              type="submit"
              className="w-full bg-primary cursor-pointer hover:bg-primary-hover transition-all duration-300 text-white font-semibold py-3 rounded"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              <div className="flex-grow border-t border-border" />
              <span className="mx-4 text-body text-sm">Or continue with</span>
              <div className="flex-grow border-t border-border" />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => signIn("google")}
                className="w-full flex items-center justify-center bg-background border border-border rounded py-2 text-body font-medium hover:bg-[#222] transition-colors cursor-pointer"
              >
                <Image
                  alt="Google Logo"
                  width={36}
                  height={36}
                  src="/Google.svg"
                />
                Google
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
