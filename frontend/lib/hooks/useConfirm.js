// hooks/useConfirm.js
import { useCallback } from 'react';
import toast from 'react-hot-toast';

export const useConfirm = () => {
    return useCallback((message) => {
        return new Promise((resolve) => {
            let toastId;

            const handleOutsideClick = (e) => {
                // Check if click is outside the toast container
                const toastElement = document.querySelector(`[data-toast-id="${toastId}"]`);
                if (toastElement && !toastElement.contains(e.target)) {
                    cleanup();
                    resolve(false);
                }
            };

            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    cleanup();
                    resolve(false);
                }
            };

            const cleanup = () => {
                toast.dismiss(toastId);
                document.removeEventListener('click', handleOutsideClick);
                document.removeEventListener('keydown', handleEscape);
            };

            toastId = toast.custom(
                (t) => (
                    <div
                        data-toast-id={toastId}
                        className={`
              ${t.visible ? 'animate-enter' : 'animate-leave'} 
              w-80 bg-(--color-card) shadow-xl rounded-2xl pointer-events-auto 
              border border-badge overflow-hidden
            `}
                    >
                        <div className="p-5">
                            <p className="text-sm font-medium text-(--color-primary-text) leading-relaxed">
                                {message}
                            </p>
                        </div>
                        <div className="flex border-t border-badge">
                            <button
                                onClick={() => {
                                    cleanup();
                                    resolve(false);
                                }}
                                className="
                  flex-1 px-4 py-3 text-sm font-medium 
                  text-secondary-text 
                  hover:bg-badge hover:text-(--color-primary-text)
                  transition-colors duration-200
                "
                            >
                                Cancel
                            </button>
                            <div className="w-px bg-badge" />
                            <button
                                onClick={() => {
                                    cleanup();
                                    resolve(true);
                                }}
                                className="
                  flex-1 px-4 py-3 text-sm font-medium 
                  text-error hover:bg-error/10
                  transition-colors duration-200
                "
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ),
                { duration: Infinity, position: 'top-center' }
            );

            // Add listeners after a tick to avoid immediate trigger
            setTimeout(() => {
                document.addEventListener('click', handleOutsideClick);
                document.addEventListener('keydown', handleEscape);
            }, 0);
        });
    }, []);
};