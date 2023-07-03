import { useState, useEffect } from 'react' ;
import ShopCarousel from './ShopCarousel';

const ShopLatest = () => {
	const [data, setData] = useState();
	const [isLoading, setLoading] = useState(false);
	const [current, setCurrent] = useState([]);
	
	useEffect(() => {
		fetch('/api/shop/latest')
			.then((res) => res.json())
			.then((data) => {
				setData(data.result);
			});
		}, []);
		
		if(!data) return <></>;
	
	return (
		<>
			<h2 className="mb-3 text-3xl font-bold">In the Shop...</h2>
			<ShopCarousel items={data} />
		</>
	);
}

export default ShopLatest;