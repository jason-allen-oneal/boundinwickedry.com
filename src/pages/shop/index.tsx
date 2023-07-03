import type { NextPage } from "next";
import Layout from '@/components/Layout';
import ShopLatest from "@/components/shop/Latest";

const ShopPage: NextPage = () => {
	const data = {
		title: "Shop Home",
		description: "Buy your secrets.",
	};
	
	return (
		<>
			<Layout data={data}>
				<div className="col-start-2 col-span-4">
					<ShopLatest />
				</div>
			</Layout>
		</>
	);
};

export default ShopPage;