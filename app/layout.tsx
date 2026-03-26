import { auth } from "@/auth";
import ThemeProvider from "@/context/ThemeProvider";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import localFont from "next/font/local";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";

const inter = localFont({
  src: "./font/InterVF.ttf",
  variable: "--font-inter",
  weight: "100 200 300 400 500 600 700 800 900",
});

const spaceGrotesk = localFont({
  src: "./font/SpaceGroteskVF.ttf",
  variable: "--font-space-grotesk",
  weight: "400 500 600 700",
});

export const metadata: Metadata = {
  title: "Dev Overflow",
  description:
    "A community-driven platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers from around the world. Explore topics in web development, mobile app development, algorithms, data structures, and more.",
  icons: {
    icon: "/images/site-logo.svg",
  },
  generator: "Next.js",
  applicationName: "Dev Overflow",
  referrer: "origin-when-cross-origin",
  keywords: ["JavaScript", "React", "Next.js", "web development", "Dev Overflow"],
  authors: [{ name: "Adrian" }, { name: "Dev Team", url: "https://devoverflow.dev/about" }],
  creator: "Adrian",
  publisher: "Dev Overflow",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

// Completed setup metadata
// export const metadata = {
//   title: "Dev Overflow",
//   description:
//     "Dev Overflow is a community-driven platform to ask and answer real-world programming questions. Learn, grow, and connect with developers around the world.",

//   generator: "Next.js",
//   applicationName: "Dev Overflow",
//   referrer: "origin-when-cross-origin",

//   keywords: [
//     "Dev Overflow",
//     "programming questions",
//     "developer Q&A",
//     "web development",
//     "JavaScript",
//     "React",
//     "Node.js",
//     "algorithms",
//     "data structures",
//     "developer community",
//   ],

//   authors: [
//     { name: "Adrian" },
//     { name: "Dev Overflow Team", url: "https://devoverflow.dev/team" },
//   ],
//   creator: "Adrian",
//   publisher: "Dev Overflow",

//   formatDetection: {
//     email: false,
//     address: false,
//     telephone: false,
//   },

//   robots: {
//     index: true,
//     follow: true,
//     nocache: false,
//     googleBot: {
//       index: true,
//       follow: true,
//       noimageindex: false,
//       "max-video-preview": -1,
//       "max-image-preview": "large",
//       "max-snippet": -1,
//     },
//   },

//   icons: {
//     icon: "/images/site-logo.svg", // regular favicon
//     shortcut: "/favicon.ico", // browser address bar icon
//     apple: "/apple-touch-icon.png", // Apple devices
//     other: [
//       {
//         rel: "mask-icon",
//         url: "/safari-pinned-tab.svg",
//         color: "#5bbad5",
//       },
//     ],
//   },

//   // Optional: Theme color for browser UI and mobile experience
//   themeColor: "#18181b",

//   // Optional: Color for Microsoft tiles and pinned sites
//   msapplication: {
//     TileColor: "#ffffff",
//     TileImage: "/mstile-150x150.png",
//   },
// };

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <SessionProvider session={session}>
        <body className={`${inter.className} ${spaceGrotesk.variable} antialiased`}>
          <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
          <Toaster richColors />
        </body>
      </SessionProvider>
    </html>
  );
};

export default RootLayout;
