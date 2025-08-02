// app/layout.js

import './globals.css';
import Navbar from '../components/Navbar'; // ✅ Correct way to import

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
