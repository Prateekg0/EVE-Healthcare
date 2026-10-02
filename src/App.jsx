import { useCallback, useState } from 'react';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Modal from './components/Modal.jsx';
import Toast from './components/Toast.jsx';

import HomePage from './pages/HomePage.jsx';
import BookingsPage from './pages/BookingsPage.jsx';

import { useAuth } from './context/AuthContext.jsx';

export default function App() {
  const { user, request, signIn, signOut } = useAuth();

  const [page, setPage] = useState('home');
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState('');

  const notify = useCallback((message) => {
    setToast(message);

    window.setTimeout(() => setToast(''), 3500);
  }, []);

  const navigate = (nextPage) => {
    setPage(nextPage);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleBook = (centre, test) => {
    if (!user) {
      return setModal('login');
    }

    setModal({ centre, test });
  };

  const payBooking = async (bookingId) => {
    try {
      const result = await request('/payments', {
        method: 'POST',
        body: JSON.stringify({ bookingId }),
      });

      notify(result.message);
    } catch (error) {
      notify(error.message);
    }
  };

  const handleSignOut = () => {
    signOut();
    navigate('home');
    notify('You have signed out.');
  };

  const handleAuthSuccess = (data) => {
    signIn(data);
    setModal(null);

    notify(`Welcome, ${data.user.name.split(' ')[0]}!`);
  };

  const handleBookingSuccess = () => {
    setModal(null);

    notify('Your test is booked. Complete payment in My bookings.');
  };

  return (
    <>
      <Header
        page={page}
        user={user}
        onNavigate={navigate}
        onSignOut={handleSignOut}
        onOpenAuth={setModal}
      />

      <main>
        {page === 'home' ? (
          <HomePage onBook={handleBook} />
        ) : (
          <BookingsPage
            onPay={payBooking}
            onChanged={notify}
          />
        )}
      </main>

      <Footer />

      {modal && (
        <Modal
          type={modal}
          onClose={() => setModal(null)}
          onAuthSuccess={handleAuthSuccess}
          onBooked={handleBookingSuccess}
        />
      )}

      <Toast message={toast} />
    </>
  );
}