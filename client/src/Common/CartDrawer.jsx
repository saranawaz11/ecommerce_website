import { FaXmark } from 'react-icons/fa6';
import CartContent from '../Cart/CartContent';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux'


function CartDrawer({ toggleCartDrawer }) {
    const navigate = useNavigate()
    const { user, guestId } = useSelector((state) => state.auth)
    const { cart } = useSelector((state) => state.cart)
    const userId = user ? user._id : null;

    const handleCheckout = () => {
        toggleCartDrawer();
        if (!user) {
            navigate('/login?redirect=checkout')
        } else {
            navigate('/checkout')
        }
    }
    return (
        <div className="flex flex-col h-full z-50">
            {/* Header */}
            <div className="p-4 border-b flex justify-end">
                <button onClick={toggleCartDrawer}>
                    <FaXmark className="h-5 w-5 btn hover:scale-125 cursor-pointer" />
                </button>
            </div>

            {/* Scrollable cart content */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
                <h2 className="text-green-950 text-xl font-bold pb-3">Your Cart</h2>
                {cart && cart?.orderItems?.length > 0 ? (
                    <CartContent cart={cart} userId={userId} guestId={guestId} />
                ) : (
                    <p>Your cart is empty</p>
                )}

            </div>

            {/* Checkout section (fixed at bottom) */}
            <div className="p-2.5 border-t">
                <div className=" text-sm rounded">
                    {cart && cart?.orderItems?.length > 0 && (
                        <>
                            <button onClick={handleCheckout} className="w-full rounded btn bg-black text-white p-2 hover:text-slate-200">
                                Checkout
                            </button>
                            <p className="text-xs text-center tracking-tighter">
                                Shipping, taxes and discount codes calculated at checkout.
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}


export default CartDrawer;