import "./globals.css";

export const metadata = {
  title: "macOS Boring Wallpaper",
  description: "Plain color. Nothing fancy.",
  metadataBase: new URL("https://boring.jalal.works"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
