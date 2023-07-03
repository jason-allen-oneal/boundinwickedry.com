import { useRouter } from "next/router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons' 
import { useCart } from '@/lib/contexts/cart';

const ViewCart = () => {
	const router = useRouter();
	const { itemCount } = useCart();
	
	const handleClick = () => {
		router.push("/shop/view-cart/");
	}
	
	return (
		<button
		  className="btn btn-secondary btn-outline"
		  onClick={handleClick}
		>
		  {' '+itemCount}
		  <FontAwesomeIcon icon={faCartShopping} />
		</button>
	);
}

export default ViewCart;