import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "@/pages/Home";
import Book from "@/pages/Book";
import Services from "@/pages/Services";
import Fleet from "@/pages/Fleet";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Toaster
          position="top-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "#0F1216",
              border: "1px solid #2A3342",
              color: "#E7EBF2",
              fontFamily: "'Manrope', sans-serif",
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book" element={<Book />} />
          <Route path="/services" element={<Services />} />
          <Route path="/fleet" element={<Fleet />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
