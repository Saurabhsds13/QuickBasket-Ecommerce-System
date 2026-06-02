import { useState } from "react";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <section className="relative my-16 rounded-3xl bg-gradient-to-br from-green-600 to-emerald-700 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="relative px-8 py-16 md:py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Get Fresh Deals in Your Inbox
        </h2>
        <p className="text-green-100 mb-8 max-w-lg mx-auto">
          Subscribe for exclusive offers, new arrivals, and weekly recipe inspiration.
        </p>

        {subscribed ? (
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-medium">
            <svg className="w-5 h-5 text-green-200" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            You're subscribed! Check your inbox.
          </div>
        ) : (
          <form
            onSubmit={handleSubscribe}
            className="max-w-md mx-auto flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-xl border-0 py-3.5 px-5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300 shadow-lg"
              required
            />
            <button
              type="submit"
              className="bg-white text-green-700 font-semibold py-3.5 px-7 rounded-xl shadow-lg hover:bg-green-50 transition-colors duration-200"
            >
              Subscribe
            </button>
          </form>
        )}

        <p className="text-green-200/70 text-xs mt-4">
          No spam, unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </section>
  );
};

export default NewsletterSignup;
