// #HOMEWORK — footer sederhana: copyright + links
export default function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-200 bg-white/60 py-6">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-2 px-4 text-sm text-slate-500 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} KelanaAI. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="https://github.com/rahadianivan09/kelana-ai" className="hover:text-blue-800">GitHub</a>
          <a href="/" className="hover:text-blue-800">Home</a>
        </div>
      </div>
    </footer>
  );
}