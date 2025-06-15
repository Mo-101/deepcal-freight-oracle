
import DeepCALHeader from "@/components/DeepCALHeader";

const Settings = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white">
    <DeepCALHeader />
    <main className="container max-w-4xl mx-auto pt-12 px-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <span role="img" aria-label="settings">⚙️</span>
        Settings
      </h2>
      <div className="p-6 bg-white rounded-xl shadow-md text-center text-slate-600">
        Personalize your DeepCAL experience!<br />
        (Settings features coming soon.)
      </div>
    </main>
  </div>
);

export default Settings;
