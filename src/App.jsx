import Footer from "./Components/Footer";
import Header from "./Components/Header";
import Heading from "./Components/Heading";
import Home from "./Components/Home";
import Lower from "./Components/Lower";
import Paragraph from "./Components/Paragraph";

function App() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-zinc-50 dark:bg-zinc-950">
      <Heading />
      <Home />
      <main className="flex flex-1 flex-col">
        <Paragraph />
        <Header />
        <Lower />
      </main>
      <Footer />
    </div>
  );
}

export default App;
