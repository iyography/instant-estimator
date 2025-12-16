export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Instant Estimator</h1>
        <p className="text-slate-600">Capture leads with instant price estimates</p>
      </div>
      {children}
    </div>
  );
}
