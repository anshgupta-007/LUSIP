return (
    <>
      <ToastContainer />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="mt-6 min-h-screen">
          {/* Your main content here */}
        </div>
      )}
    </>
  );
  