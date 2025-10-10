const EnvDebug = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Debug</h1>
      <div className="space-y-2 font-mono text-sm">
        <div>
          <strong>VITE_JUDGE0_URL:</strong>{' '}
          {import.meta.env.VITE_JUDGE0_URL || 'NOT SET'}
        </div>
        <div>
          <strong>VITE_JUDGE0_API_KEY:</strong>{' '}
          {import.meta.env.VITE_JUDGE0_API_KEY
            ? `${import.meta.env.VITE_JUDGE0_API_KEY.substring(0, 10)}...`
            : 'NOT SET'}
        </div>
        <div>
          <strong>VITE_API_BASE_URL:</strong>{' '}
          {import.meta.env.VITE_API_BASE_URL || 'NOT SET'}
        </div>
      </div>
    </div>
  );
};

export default EnvDebug;
