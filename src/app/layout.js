export const metadata = {
  title: "macOS Boring Wallpaper",
  description: "Plain color. Nothing fancy.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
