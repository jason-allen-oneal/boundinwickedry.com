import Image from 'next/image';
import { formatPrice, truncate } from '@/lib/utils';
import ShopButtons from './ShopButtons';
import Link from 'next/link';

type Props = {
	item: Item;
	features: string[];
	category?: ShopCategory;
}

const ProductCard = ({ item, features, category }: Props) => {
	let cat: ShopCategory | null;
 if(category === undefined){
   cat = item.ShopCategory;
 }else{
   cat = category;
 }
	return (
		<div className="container border border-primary bg-base-200 text-base-content p-2">
			<div className="relative z-10">
				<div className="flex flex-wrap items-center text-center">
					<div className="flex w-full relative item-stretch">
						<div className="w-full">
							<Image
								src={`/images/shop/${item.image}`}
								alt={item.name}
								height={100}
								width={100}
							/>
						</div>
					</div>
					
					<div className="w-full flex flex-col justify-between">
						<div>
							<div className="font-bold text-xl flex-wrap">{item.name}</div>
							In: <Link href={`/shop/category/${cat.id}/${cat.slug}/`}>{cat.name}</Link>
							<div className="flex flex-wrap text-center pt-4 mb-2">
							{features && features.map((feature: string) => (
								<div key={feature} className="mr-2 mb-2 rounded-full px-3 py-1 text-xs bg-green-400 text-green-900">{feature}</div>
							))}
							</div>
							<p className="text-xs leading-relaxed text-gray-50">{truncate(item.description.replace(/<\/?[^>]+(>|$)/g, ""))}</p>
						</div>
						<div className="w-full sm:flex-1 grid gap-4 grid-cols-1 pt-6">
							<ShopButtons item={item} view="category" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ProductCard;