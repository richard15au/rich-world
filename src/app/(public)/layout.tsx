import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main
        className="container"
        style={{
          flex: 1,
          paddingTop: '2.5rem',
          paddingBottom: '3.5rem',
        }}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
