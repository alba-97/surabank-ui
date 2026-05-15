const Spinner = () => {
  return (
    <div className="mobile-container flex items-center justify-center min-h-screen bg-white dark:bg-[#111827]" role="status" aria-label="Cargando">
      <div className="w-10 h-10 border-2 border-[#005cee]/20 border-t-[#005cee] rounded-full animate-spin" />
    </div>
  );
};

export default Spinner;
