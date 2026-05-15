const Spinner = () => {
  return (
    <div
      className="mobile-container flex items-center justify-center min-h-screen bg-page"
      role="status"
      aria-label="Cargando"
    >
      <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );
};

export default Spinner;
