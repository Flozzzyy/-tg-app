export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-10 h-10">
        <div className="absolute w-full h-full border-4 border-indigo-500/20 rounded-full"></div>
        <div className="absolute w-full h-full border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};