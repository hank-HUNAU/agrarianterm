import { HashRouter as Router, Routes, Route } from "react-router-dom";
// 展示平台
import GraphPage from "@/pages/GraphPage";
import SearchPage from "@/pages/SearchPage";
import ComparePage from "@/pages/ComparePage";
import StatisticsPage from "@/pages/StatisticsPage";
// 标注平台
import AnnotationTasks from "@/pages/annotation/AnnotationTasks";
import AnnotationWorkspace from "@/pages/annotation/AnnotationWorkspace";
import AnnotationReview from "@/pages/annotation/AnnotationReview";
import AnnotationDashboard from "@/pages/annotation/AnnotationDashboard";
// 布局
import DisplayLayout from "@/components/layouts/DisplayLayout";
import AnnotationLayout from "@/components/layouts/AnnotationLayout";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 展示平台 */}
        <Route element={<DisplayLayout />}>
          <Route path="/" element={<GraphPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
        </Route>
        {/* 标注平台 */}
        <Route path="/annotation" element={<AnnotationLayout />}>
          <Route index element={<AnnotationTasks />} />
          <Route path="workspace/:taskId" element={<AnnotationWorkspace />} />
          <Route path="review" element={<AnnotationReview />} />
          <Route path="dashboard" element={<AnnotationDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}
