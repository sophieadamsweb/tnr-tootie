import type { Metadata } from "next";
// Fonts come from npm and get bundled with the site, so nothing loads from
// Google at runtime and the build works offline. Fraunces for the storybook
// headings, Nunito for body text because it's round, friendly and very readable.
import "@fontsource-variable/fraunces/full.css";
import "@fontsource-variable/nunito";
import "./globals.css";

export const metadata: Metadata = {
  title: "TNR Basics: Catching the Cat",
  description: "TNR basics: how to use a box trap to catch a community cat",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
