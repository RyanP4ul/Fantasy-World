import WebNav from "../web/web-nav";

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen text-foreground">
      {/* <div className="absolute z-0 w-full h-[100px] bg-cover bg-center opacity-15 bg-blend-multiply"
      style={{ backgroundImage: "url('/bg-sub-fourhorsemen.jpg')" }}>
        </div> */}
      <div
        className="absolute inset-0 bg-cover bg-center -z-10 h-80"
        style={{ backgroundImage: `url(/bg-sub-fourhorsemen.jpg)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/70 to-background"></div>
      </div>
      <WebNav />
      <div className="container mx-auto max-w-6xl">
        {children}
        <footer className=" mt-auto">
          <div className="container mx-auto px-4 py-12">
            <div className="mt-8 pt-8 text-center">
              <p className="text-gray-400 text-sm">
                © 2025 SilverAQ. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
