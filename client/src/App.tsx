import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import CaravanRoutes from "./pages/CaravanRoutes";
import CaravanRouteDetail from "./pages/CaravanRouteDetail";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCategories from "./pages/admin/Categories";
import AdminPosts from "./pages/admin/Posts";
import AdminRoutes from "./pages/admin/Routes";
import AdminHero from "./pages/admin/Hero";
import AdminFeatures from "./pages/admin/Features";
import AdminTeam from "./pages/admin/Team";
import AdminSettings from "./pages/admin/Settings";
import AdminMedia from "./pages/admin/Media";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/blog" component={BlogList} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/karavan" component={CaravanRoutes} />
      <Route path="/karavan/:slug" component={CaravanRouteDetail} />
      
      {/* Admin Routes */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/categories" component={AdminCategories} />
      <Route path="/admin/posts" component={AdminPosts} />
      <Route path="/admin/routes" component={AdminRoutes} />
      <Route path="/admin/hero" component={AdminHero} />
      <Route path="/admin/features" component={AdminFeatures} />
      <Route path="/admin/team" component={AdminTeam} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/admin/media" component={AdminMedia} />
      
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
