import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import { Layout } from "./components/Layout";
import { Explore } from "./pages/Explore";
import { PinDetail } from "./pages/PinDetail";
import { Boards } from "./pages/Boards";
import { BoardDetail } from "./pages/BoardDetail";
import { Profile } from "./pages/Profile";
import { PinEditor } from "./pages/PinEditor";
import { About } from "./pages/About";
import { NotFound } from "./pages/NotFound";
export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Explore />} />
            <Route path="search" element={<Explore isSearch />} />
            <Route path="pin/:id" element={<PinDetail />} />
            <Route path="pin/:id/edit" element={<PinEditor />} />
            <Route path="boards" element={<Boards />} />
            <Route path="boards/:id" element={<BoardDetail />} />
            <Route path="profile" element={<Profile />} />
            <Route path="create" element={<PinEditor />} />
            <Route path="about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </DataProvider>
    </BrowserRouter>
  );
}
