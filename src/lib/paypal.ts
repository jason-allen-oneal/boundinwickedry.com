const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT;
const PAYPAL_SECRET = process.env.NEXT_PUBLIC_PAYPAL_SECRET;
const base = "https://api-m.sandbox.paypal.com";

export type PPItem = {
	name: string;
	quantity: string;
	category: string;
	sku: string;
	unit_amount: {
		currency_code: string;
		value: string;
	}
}

export type PPBuyData = {
	description: string;
	amount: {
		currency_code: string;
		value: string;
		breakdown: {
			item_total: {
				currency_code: string;
				value: string;
			};
			shipping: {
				currency_code: string;
				value: string;
			};
		};
	};
}

export type OrderData = PPItem[] | PPBuyData;

const shipping = 10;

export const createOrder = async (cart: OrderData) => {
	let order: any;
	
	if (!('description' in cart)){
		let total = 0;
		
		for(const itm of cart){
			total += +itm.unit_amount.value;
		}
		
		order = {
			"description": "BoundInWickedry.com Products",
			"amount": {
				"currency_code": "USD",
				"value": total + shipping,
				"breakdown": {
					"item_total": {
						"currency_code": "USD",
						"value": total
					},
					"shipping": {
						"currency_code": "USD",
						"value": ''+shipping
					},
				},
				items: cart
			}
		};
	}else{
		order = cart;
	}
	
	const accessToken = await generateAccessToken();
	const url = `${base}/v2/checkout/orders`;
	
	const response = await fetch(url, {
		method: "post",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({
			intent: "CAPTURE",
			purchase_units: [order]
		}),
	});
	
	return handleResponse(response);
}

export const capturePayment = async (orderId: string) => {
	const accessToken = await generateAccessToken();
	const url = `${base}/v2/checkout/orders/${orderId}/capture`;
	const response = await fetch(url, {
		method: "post",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	});
	
	return handleResponse(response);
}

export const generateAccessToken = async () => {
	const auth = Buffer.from(PAYPAL_CLIENT + ":" + PAYPAL_SECRET).toString("base64");
	const response = await fetch(`${base}/v1/oauth2/token`, {
		method: "post",
		body: "grant_type=client_credentials",
		headers: {
			Authorization: `Basic ${auth}`,
		},
	});
	
	const jsonData = await handleResponse(response);
	return jsonData.access_token;
}

async function handleResponse(response: any) {
	if (response.status === 200 || response.status === 201) {
		return response.json();
	}
	
	const errorMessage = await response.text();
	throw new Error(errorMessage);
}