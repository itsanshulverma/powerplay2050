import { Inter } from 'next/font/google';
import { useState, useEffect, ChangeEvent } from 'react';
import citiesData from '@/data/data.json';

const inter = Inter({ subsets: ['latin'] });

type T = keyof typeof citiesData;

const multiplyingFactors: Record<number, number> = {
	1: 0.5,
	2: 0.5,
	3: 1,
	4: 1,
	5: 1.5,
	6: 1.5,
	7: 2,
	8: 2,
};

export default function Home() {
	const [name, setName] = useState('');
	const [citiesToSelect, setCitiesToSelect] = useState(['']);
	const [selectedCity, setSelectedCity] = useState('');
	const [selectedCities, setSelectedCities] = useState<string[]>([]);
	const [showModal, setShowModal] = useState(false);
	const [sharePrice, setSharePrice] = useState(50);

	useEffect(() => {
		const cities = Object.keys(citiesData);
		setCitiesToSelect(cities);
	}, []);

	useEffect(() => {
		setSelectedCity(citiesToSelect[0]);
	}, [citiesToSelect]);

	useEffect(() => {}, [selectedCities]);

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
	};

	const handleAddCity = () => {
		if (selectedCity !== '' && selectedCity !== undefined) {
			setSelectedCities((prev) => [...prev, selectedCity]);
			setCitiesToSelect((prev) => prev.filter((city) => city !== selectedCity));
			setSelectedCity('');
		}
	};

	const handleSubmit = () => {
		const highestPrices: Record<number, number> = {};
		const highestPriceCities: Record<number, string> = {};
		selectedCities.forEach((cityName) => {
			const city = citiesData[cityName as keyof typeof citiesData];
			if (city) {
				const { price, 'color-code': colorCode } = city;
				if (
					highestPrices[colorCode] === undefined ||
					price > highestPrices[colorCode]
				) {
					highestPrices[colorCode] = price;
					highestPriceCities[colorCode] = cityName;
				}
			}
		});
		let totalPrice = 50;
		for (const colorCode in highestPriceCities) {
			const price = highestPrices[colorCode] || 0;
			const factor = multiplyingFactors[colorCode] || 1;
			totalPrice += price * factor;
		}

		setSharePrice(totalPrice);
		setShowModal(true);
	};

	return (
		<div className="grid place-items-center h-screen">
			<h1 className="font-bold text-lg mt-6 sm:text-4xl sm:m-1">
				PowerPlay 2050 | Share Price Calculator
			</h1>
			<div className="flex flex-row gap-5 flex-wrap justify-items-center items-center justify-center content-center">
				<form className="card card-normal w-96 bg-base-100 shadow-xl self-center m-4">
					<div className="card-body">
						<div>
							<label htmlFor="name">Your Name:</label>
							<input
								className="input input-bordered w-full max-w-xs mt-2"
								type="text"
								id="name"
								name="name"
								value={name}
								onChange={handleInputChange}
							/>
						</div>
						<div>
							<h2 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
								Cities:
							</h2>
							<select
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								onChange={(e) => setSelectedCity(e.target.value)}
							>
								{citiesToSelect.map((city) => (
									<option key={city} value={city}>
										{city}
									</option>
								))}
							</select>
							<button
								className={`${
									citiesToSelect.length === 0
										? 'cursor-not-allowed opacity-50'
										: ''
								} btn mt-4 mb-1`}
								disabled={citiesToSelect.length === 0}
								type="button"
								onClick={handleAddCity}
							>
								Add City
							</button>
						</div>
					</div>
				</form>
				{selectedCities.length > 0 && (
					<div className="card card-normal w-96 bg-base-100 shadow-xl self-center m-4">
						<div className="card-body">
							<h1 className="font-bold text-lg">Selected Cities</h1>
							<ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto sm:max-h-32">
								{selectedCities.map((city) => (
									<li key={city} value={city} className="p-3 sm:p-4">
										{city}
									</li>
								))}
							</ul>
							<button
								onClick={handleSubmit}
								className="btn btn-active btn-neutral"
							>
								Calculate
							</button>
						</div>
					</div>
				)}
			</div>
			{showModal ? (
				<>
					<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
						<div className="card card-normal w-96 bg-base-100 shadow-xl self-center outline-none focus:outline-none m-4">
							<div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
								<h3 className="text-3xl font-semibold">{name}</h3>
								<button
									className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
									onClick={() => setShowModal(false)}
								>
									<span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
										×
									</span>
								</button>
							</div>
							<div className="relative p-6 flex-auto">
								<p className="my-4 text-blueGray-500 text-xl leading-relaxed">
									Your share price is: ₹{sharePrice}
								</p>
							</div>
							<div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
								<button
									className="btn"
									type="button"
									onClick={() => {
										setSharePrice(50);
										setShowModal(false);
									}}
								>
									Close
								</button>
							</div>
						</div>
					</div>
					<div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
				</>
			) : null}
		</div>
	);
}
