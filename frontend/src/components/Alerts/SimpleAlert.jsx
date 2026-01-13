import Swal from 'sweetalert2';

export const coloredToast = (color, title, position = 'top-end', text, icon, timer = 3000) => {
    const toast = Swal.mixin({
        toast: true,
        position,
        showConfirmButton: false,
        timer,
        showCloseButton: true,
        customClass: {
            popup: `color-${color}`,
        },
    });
    toast.fire({
        title,
        text,
        position,
        icon,
    });
};