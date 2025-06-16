import Nav from "../components/Nav";
import Spinner from "../components/Spinner";

function RootLayout({ children, title, loading }) {
  return (
    <>
      <meta charSet="utf-8" />
      <title>{title ?? "Home"} | Milky Dairy</title>
      <meta
        name="description"
        content="E-commerce store built with React, Node, Express and Postgres"
      />
      <meta
        name="robots"
        content="max-snippet:-1, max-image-preview:large, max-video-preview:-1"
      />
      <style type="text/css">{`
        html, body {
          height: 100%;
          margin: 0;
          padding: 0;
        }
        #root {
          height: 100%;
        }
      `}</style>

      <div className="min-h-screen flex flex-col bg-gray-50">
        <Nav />

        {loading ? (
          <div className="flex-1 flex items-center justify-center pt-16">
            <Spinner size={100} loading />
          </div>
        ) : (
          <main className="flex-1 pt-16 pb-8">
            <div className="w-full h-full">{children}</div>
          </main>
        )}

        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} Milky Dairy —
              <a
                href="https://github.com/Saad09992"
                className="text-blue-600 hover:text-blue-800 ml-1 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                @Saad09992
              </a>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default RootLayout;
