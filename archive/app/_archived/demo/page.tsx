import { StartupAnalystAppDemo } from "@/components/sirius/startup-analyst-demo";
import { getStartupAnalystDemoFiles } from "@/lib/startup-analyst-demo";

export default function DemoPage() {
  const files = getStartupAnalystDemoFiles();

  return <StartupAnalystAppDemo files={files} />;
}
