

const NotFound = () => {


  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oj! Den här sidan finns inte.</p>
        <a href="/" className="inline-flex items-center text-primary underline hover:text-primary/90">
          Tillbaka till starten
        </a>
      </div>
    </div>
  );
};

export default NotFound;
