import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleRTL, toggleTheme, toggleLocale, toggleMenu, toggleLayout, toggleAnimation, toggleNavbar, toggleSemidark } from './store/themeConfigSlice';
import store from './store';
// import DisableCopyPaste from './components/Layouts/DisableCopyPaste';
import NotificationPopup from './notificationPopup';
import { registerServiceWorker } from './registerServiceWorker';

function App({ children }) {
    const themeConfig = useSelector((state) => state.themeConfig);
    const { user, isAuthenticated } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(toggleTheme(localStorage.getItem('theme') || themeConfig.theme));
        dispatch(toggleMenu(localStorage.getItem('menu') || themeConfig.menu));
        dispatch(toggleLayout(localStorage.getItem('layout') || themeConfig.layout));
        dispatch(toggleRTL(localStorage.getItem('rtlClass') || themeConfig.rtlClass));
        dispatch(toggleAnimation(localStorage.getItem('animation') || themeConfig.animation));
        dispatch(toggleNavbar(localStorage.getItem('navbar') || themeConfig.navbar));
        dispatch(toggleLocale(localStorage.getItem('i18nextLng') || themeConfig.locale));
        dispatch(toggleSemidark(localStorage.getItem('semidark') || themeConfig.semidark));
    }, [dispatch, themeConfig.theme, themeConfig.menu, themeConfig.layout, themeConfig.rtlClass, themeConfig.animation, themeConfig.navbar, themeConfig.locale, themeConfig.semidark]);

    useEffect(() => {
        if (isAuthenticated && user?._id) {
            const hasRegistered = sessionStorage.getItem("hasRegistered");
    
            if (!hasRegistered) {
                registerServiceWorker(user._id);
                sessionStorage.setItem("hasRegistered", "true"); // ✅ Prevent multiple calls
            }
        } else {
            sessionStorage.removeItem("hasRegistered"); // ✅ Reset when user logs out
        }
    }, [isAuthenticated, user?._id]);
    

    return (
        <div
            className={`${(store.getState().themeConfig.sidebar && 'toggle-sidebar') || ''} ${themeConfig.menu} ${themeConfig.layout} ${themeConfig.rtlClass
                } main-section antialiased relative font-nicysans text-sm font-normal`}
        >

            {/* <DisableCopyPaste selector=".protected-content" userRole={user?.role} /> */}
            <NotificationPopup />
            {children}

        </div>
    );
}

export default App;
